import { ActionRowBuilder, ApplicationCommandOptionType, AttachmentBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, GuildMemberRoleManager, PermissionFlagsBits } from 'discord.js';
import { ChatInput, Button } from '@akki256/discord-interaction';
import Captcha from '@haileybot/captcha-generator';

const duringAuthentication = new Set();

const verifyCommand = new ChatInput(
  {
    name: 'verify',
    description: 'ロールを使用した認証パネルを作成',
    options: [
      {
        name: 'type',
        description: '認証タイプ',
        choices: [
          { name: 'ボタン', value: 'button' },
          { name: '画像', value: 'image' },
        ],
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'role',
        description: '認証成功時に付与するロール',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
      {
        name: 'description',
        description: '埋め込みの説明文 (半角スペース2つで改行)',
        type: ApplicationCommandOptionType.String,
        maxLength: 4096,
      },
      {
        name: 'color',
        description: '埋め込みの色',
        type: ApplicationCommandOptionType.Number,
        choices: [
          { name: '🔴赤色', value: Colors.Red },
          { name: '🟠橙色', value: Colors.Orange },
          { name: '🟡黄色', value: Colors.Yellow },
          { name: '🟢緑色', value: Colors.Green },
          { name: '🔵青色', value: Colors.Blue },
          { name: '🟣紫色', value: Colors.Purple },
          { name: '⚪白色', value: Colors.White },
          { name: '⚫黒色', value: Colors.DarkButNotBlack },
        ],
      },
      {
        name: 'image',
        description: '画像',
        type: ApplicationCommandOptionType.Attachment,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels,
    dmPermission: false,
  },
  { coolTime: 600_000 },
  async (interaction) => {

    if (!interaction.inCachedGuild()) return;

    const verifyTypeName = new Map([ ['button', 'ボタン'], ['image', '画像'] ]);
    const verifyType = interaction.options.getString('type', true);
    const role = interaction.options.getRole('role', true);

    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles))
      return interaction.reply({ content: `\`❌\` **${interaction.user.username}**に\`ロールを管理\`権限を付与してください！`, ephemeral: true });
    if (role.managed || role.id == interaction.guild.roles.everyone.id)
      return interaction.reply({ content: '`❌` そのロールは認証に使用することはできません', ephemeral: true });
    if (!role.editable)
      return interaction.reply({ content: '`❌` そのロールはBOTより高い位置にあるため、認証に使用することはできません', ephemeral: true });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`\`✅\` 認証: ${verifyTypeName.get(verifyType)!}`)
          .setDescription(interaction.options.getString('description')?.replace('  ', '\n') || null)
          .setColor(interaction.options.getNumber('color') ?? Colors.Green)
          .setImage(interaction.options.getAttachment('image')?.url || null)
          .setFields({ name: '付与されるロール', value: role.toString() }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId(`nonick-js:verify-${verifyType}`)
            .setLabel('認証')
            .setStyle(ButtonStyle.Success),
        ),
      ],
    });
  },
);

const verifyButton = new Button(
  { customId: /^nonick-js:verify-(button|image)/ },
  async (interaction) => {

    if (!interaction.inCachedGuild()) return;

    const roleId = interaction.message.embeds[0]?.fields[0]?.value?.match(/(?<=<@&)\d+(?=>)/)?.[0];
    const roles = interaction.member.roles;

    if (duringAuthentication.has(interaction.user.id))
      return interaction.reply({ content: '`❌` 現在別の認証を行っています。認証が終了するまで新たな認証を行うことはできません。', ephemeral: true });
    if (!roleId || !(roles instanceof GuildMemberRoleManager))
      return interaction.reply({ content: '`❌` 認証中に問題が発生しました。', ephemeral: true });
    if (roles.cache.has(roleId))
      return interaction.reply({ content: '`✅` 既に認証されています。', ephemeral: true });

    if (interaction.customId == 'nonick-js:verify-button') {
      roles.add(roleId, '認証')
        .then(() => interaction.reply({ content: '`✅` 認証に成功しました！', ephemeral: true }))
        .catch(() => interaction.reply({ content: '`❌` ロールを付与できませんでした。サーバーの管理者にご連絡ください', ephemeral: true }));
    }

    if (interaction.customId == 'nonick-js:verify-image') {
      await interaction.deferReply({ ephemeral: true });
      const captcha = new Captcha();
      interaction.user
        .send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: `${interaction.guild.name}: 画像認証`, iconURL: interaction.guild.iconURL() ?? undefined })
              .setDescription([
                '下の画像に表示された、緑色の文字列をこのDMに送信してください。',
                '画像が読みづらい場合は、一分程度間隔を置いて再度認証を行ってください。',
                '> ⚠️一定時間経過したり、複数回間違えると新しい認証を発行する必要があります。',
              ].join('\n'))
              .setColor(Colors.Blurple)
              .setImage('attachment://nonick-js-captcha.jpeg')
              .setFooter({ text: 'NoNICK.jsはパスワードの入力やQRコードの読み取りを要求することは決してありません。' }),
          ],
          files: [new AttachmentBuilder(captcha.JPEGStream, { name: 'nonick-js-captcha.jpeg' })],
        })
        .then(() => {
          duringAuthentication.add(interaction.user.id);
          interaction.followUp({ content: '`📨` DMで認証を続けてください。' });

          const collector = interaction.user.dmChannel!.createMessageCollector({ filter: v => v.author.id == interaction.user.id,  time: 60_000, max: 3 });

          collector.on('collect', tryMessage => {
            if (!(tryMessage.content === captcha.value)) return;

            roles.add(roleId)
              .then(() => interaction.user.send('`✅` 認証に成功しました！'))
              .catch(() => interaction.user.send('`❌` 認証に成功しましたが、ロールを付与できませんでした。サーバーの管理者にご連絡ください。'))
              .finally(() => collector.stop());
          });

          collector.on('end', (collection) => {
            if (collection.size == 3) {
              interaction.user.send({ content: '`❌` 試行回数を超えて認証に失敗しました。次回の認証は`5分後`から可能になります。' });
              setTimeout(() => duringAuthentication.delete(interaction.user.id), 300_000);
            } else {
              duringAuthentication.delete(interaction.user.id);
            }
          });
        })
        .catch(() => {
          interaction.followUp({ content: '`❌` この認証を行うにはBOTからDMを受け取れるように設定する必要があります。', ephemeral: true });
        });
    }

  },
);

module.exports = [verifyCommand, verifyButton];