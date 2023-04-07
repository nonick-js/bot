import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, Attachment, Colors, Embed, EmbedBuilder, PermissionFlagsBits, Webhook, resolveColor } from 'discord.js';
import axios from 'axios';
import { embedMakerType, getEmbedMakerButtons } from './embed/_function';

const command = new ChatInput(
  {
    name: 'embed',
    description: '埋め込みを作成',
    options: [
      {
        name: 'create',
        description: '埋め込みを新規作成',
        options: [
          {
            name: 'title',
            description: '埋め込みのタイトル',
            maxLength: 256,
            type: ApplicationCommandOptionType.String,
          },
          {
            name: 'description',
            description: '埋め込みに表示する説明文 (半角スペース2つで改行)',
            maxLength: 4096,
            type: ApplicationCommandOptionType.String,
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
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'import',
        description: 'jsonファイルから埋め込みを作成',
        options: [
          {
            name: 'json',
            description: 'jsonファイル',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'profile',
        description: '埋め込みを送信する際のプロフィールを変更',
        options: [
          {
            name: 'name',
            description: '名前',
            maxLength: 100,
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'avatar',
            description: 'アイコン',
            type: ApplicationCommandOptionType.Attachment,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    dmPermission: false,
  },
  async (interaction) => {
    const subCommand = interaction.options.getSubcommand(true);

    if (!interaction.channel?.isTextBased())
      return interaction.reply({ content: '`❌` このチャンネルでは使用できません', ephemeral: true });

    if (subCommand === 'create') {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const color = interaction.options.getNumber('color') ?? Colors.White;
      const attachment = interaction.options.getAttachment('image');

      const embed = new EmbedBuilder()
        .setTitle(!title && !description ? '埋め込み' : title)
        .setDescription(description?.replace('  ', '\n') || null)
        .setImage(attachment?.url || null)
        .setColor(color);

      interaction.reply({
        content: '`/embed profile`を使用すると、送信者のプロフィールを変更できます。',
        embeds: [embed],
        components: getEmbedMakerButtons(embed.data, embedMakerType.send),
        ephemeral: true,
      });
    }

    else if (subCommand === 'import') {
      const attachment = interaction.options.getAttachment('json', true);

      if (!attachment.contentType?.startsWith('application/json'))
        return interaction.reply({ content: '`❌` 添付されたファイルはjsonファイルではありません。', ephemeral: true });
      if (attachment.size > 3000000)
        return interaction.reply({ content: '`❌` 3MB以上のjsonファイルはインポートできません。', ephemeral: true });

      await interaction.deferReply({ ephemeral: true });
      let embeds = (await axios.get<Embed[] | Embed>(attachment.url)).data;
      if (!Array.isArray(embeds)) embeds = [embeds];

      interaction
        .followUp({
          content: '`/embed profile`を使用すると、送信者のプロフィールを変更できます。',
          embeds: embeds,
          components: getEmbedMakerButtons(embeds[0], embedMakerType.send),
        })
        .catch(() => interaction.followUp({ content: '`❌` インポートに失敗しました。 有効なファイルであるか確認してください。', ephemeral: true }));
    }

    else if (subCommand === 'profile') {
      const name = interaction.options.getString('name', true);
      const avatar = interaction.options.getAttachment('avatar');

      if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageWebhooks))
        return interaction.reply({ content: '`❌` この機能を使用するには、NoNICK.jsに`ウェブフックの管理`権限を付与する必要があります。', ephemeral: true });
      if (avatar instanceof Attachment && (!avatar.contentType || !['image/png', 'image/jpeg'].includes(avatar.contentType)))
        return interaction.reply({ content: '`❌` アバター画像には`jpeg`または`png`のみ使用できます。', ephemeral: true  });

      await interaction.deferReply({ ephemeral: true });

      const webhook = await interaction.guild?.fetchWebhooks().then(wh => wh.find(v => v.owner?.id === interaction.client.user.id)).catch(() => null);
      const res = webhook instanceof Webhook
        ? await webhook.edit({ name, avatar: avatar?.url || null }).catch(() => null)
        : await interaction.guild?.channels.createWebhook({ name, avatar: avatar?.url || null, channel: interaction.channelId }).catch(() => null);

      if (res instanceof Webhook)
        interaction.followUp({
          content: '`✅` プロフィールを変更しました！',
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: res.name, iconURL: res.avatarURL() ?? interaction.client.rest.cdn.defaultAvatar(0) })
              .setColor(resolveColor('#2b2d31')),
          ],
          ephemeral: true,
        });

      else
        interaction.followUp({ content: '`❌` プロフィールの変更に失敗しました。', ephemeral: true });
    }
  },
);

module.exports = [command];