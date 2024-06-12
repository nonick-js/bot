import { Button, ChatInput } from '@akki256/discord-interaction';
import { Captcha } from '@modules/captcha';
import { permissionField } from '@modules/fields';
import { Duration } from '@modules/format';
import { permToText } from '@modules/util';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  GuildMemberRoleManager,
  PermissionFlagsBits,
  inlineCode,
} from 'discord.js';

const duringAuthentication = new Set<string>();

const verifyTypes = {
  button: 'ボタン',
  image: '画像',
} satisfies Record<string, string>;
// const verifyTypes = ['button', 'image'] as const;
type VerifyType = keyof typeof verifyTypes;

const verifyCommand = new ChatInput(
  {
    name: 'verify',
    description: 'ロールを使用した認証パネルを作成',
    options: [
      {
        name: 'type',
        description: '認証タイプ',
        choices: Object.entries(verifyTypes).map(([value, name]) => ({
          name,
          value,
        })),
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
    defaultMemberPermissions: [
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ManageChannels,
    ],
    dmPermission: false,
  },
  (interaction) => {
    if (!interaction.inCachedGuild()) return;
    const role = interaction.options.getRole('role', true);
    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageRoles,
      )
    )
      return interaction.reply({
        content: permissionField(permToText('ManageRoles'), {
          label: 'BOTの権限が不足しています',
        }),
        ephemeral: true,
      });
    if (role.managed || role.id === interaction.guild.roles.everyone.id)
      return interaction.reply({
        content: `${inlineCode('❌')} そのロールは認証に使用することはできません`,
        ephemeral: true,
      });
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
      interaction.member.roles.highest.position < role.position
    )
      return interaction.reply({
        content: `${inlineCode(
          '❌',
        )} 自分の持つロールより上のロールを認証に使用することはできません`,
        ephemeral: true,
      });
    if (!role.editable)
      return interaction.reply({
        content: `${inlineCode(
          '❌',
        )} BOTの持つロールより上のロールを認証に使用することはできません`,
        ephemeral: true,
      });

    const verifyType: VerifyType = interaction.options.getString(
      'type',
      true,
    ) as VerifyType;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${inlineCode('✅')} 認証: ${verifyTypes[verifyType]}`)
          .setDescription(
            interaction.options.getString('description')?.replace('  ', '\n') ||
              null,
          )
          .setColor(interaction.options.getNumber('color') ?? Colors.Green)
          .setImage(interaction.options.getAttachment('image')?.url || null)
          .setFields({
            name: '付与するロール',
            value: role.toString(),
          }),
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
  {
    customId: /^nonick-js:verify-(button|image)$/,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const roleId =
      interaction.message.embeds[0]?.fields[0]?.value?.match(
        /(?<=<@&)\d+(?=>)/,
      )?.[0];
    const roles = interaction.member.roles;

    if (duringAuthentication.has(interaction.user.id))
      return interaction.reply({
        content: `${inlineCode(
          '❌',
        )} 現在別の認証を行っています。認証が終了するまで新たな認証を行うことはできません。`,
        ephemeral: true,
      });
    if (!roleId || !(roles instanceof GuildMemberRoleManager))
      return interaction.reply({
        content: `${inlineCode('❌')} 認証中に問題が発生しました。`,
        ephemeral: true,
      });
    if (roles.cache.has(roleId))
      return interaction.reply({
        content: `${inlineCode('✅')} 既に認証されています。`,
        ephemeral: true,
      });

    if (interaction.customId === 'nonick-js:verify-button') {
      roles
        .add(roleId, '認証')
        .then(() =>
          interaction.reply({
            content: `${inlineCode('✅')} 認証に成功しました！`,
            ephemeral: true,
          }),
        )
        .catch(() =>
          interaction.reply({
            content: `${inlineCode(
              '❌',
            )} ロールを付与できませんでした。サーバーの管理者にご連絡ください`,
            ephemeral: true,
          }),
        );
    }

    if (interaction.customId === 'nonick-js:verify-image') {
      await interaction.deferReply({ ephemeral: true });

      const { image, text } = Captcha.create(
        { color: '#4b9d6e' },
        {},
        { amount: 5, blur: 25 },
        { rotate: 15, skew: true },
      );

      interaction.user
        .send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `${inlineCode('✅')} 認証: ${verifyTypes.image}`,
                iconURL: interaction.guild.iconURL() ?? undefined,
              })
              .setDescription(
                [
                  '下の画像に表示された、緑色の文字列をこのDMに送信してください。',
                  '> ⚠️一定時間経過したり、複数回間違えると新しい認証を発行する必要があります。',
                ].join('\n'),
              )
              .setColor(Colors.Blurple)
              .setImage('attachment://nonick-js-captcha.jpeg')
              .setFooter({
                text: 'NoNICK.jsはパスワードの入力やQRコードの読み取りを要求することは決してありません。',
              }),
          ],
          files: [
            new AttachmentBuilder(image, { name: 'nonick-js-captcha.jpeg' }),
          ],
        })
        .then(() => {
          duringAuthentication.add(interaction.user.id);
          interaction.followUp(
            `${inlineCode('📨')} DMで認証を続けてください。`,
          );

          if (!interaction.user.dmChannel) return;

          const collector = interaction.user.dmChannel.createMessageCollector({
            filter: (v) => v.author.id === interaction.user.id,
            time: Duration.toMS('1m'),
            max: 3,
          });

          collector.on('collect', (tryMessage) => {
            if (tryMessage.content !== text) return;

            roles
              .add(roleId, '認証')
              .then(() =>
                interaction.user.send(
                  `${inlineCode('✅')} 認証に成功しました！`,
                ),
              )
              .catch(() =>
                interaction.user.send(
                  `${inlineCode(
                    '❌',
                  )} ロールを付与できませんでした。サーバーの管理者にご連絡ください`,
                ),
              )
              .finally(() => collector.stop());
          });

          collector.on('end', (collection) => {
            if (collection.size === 3) {
              interaction.user.send(
                `${inlineCode(
                  '❌',
                )} 試行回数を超えて検証に失敗しました。次回の検証は${inlineCode(
                  '5分後',
                )}から可能になります。`,
              );
              setTimeout(
                () => duringAuthentication.delete(interaction.user.id),
                Duration.toMS('5m'),
              );
            } else duringAuthentication.delete(interaction.user.id);
          });
        })
        .catch(() => {
          interaction.followUp({
            content: `${inlineCode(
              '❌',
            )} この認証を行うにはBOTからDMを受け取れるように設定する必要があります。`,
            ephemeral: true,
          });
        });
    }
  },
);

export default [verifyCommand, verifyButton];
