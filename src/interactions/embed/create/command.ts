import { ApplicationCommandOptionType, Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { embedCreateButtons } from './_components';
import { ChatInput } from '@akki256/discord-interaction';
import axios from 'axios';

const embedCommand = new ChatInput(
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
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    dmPermission: false,
  },
  async (interaction) => {

    if (!interaction.inCachedGuild() || !interaction.channel) return;
    const subCommand = interaction.options.getSubcommand(true);

    if (subCommand === 'create') {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');

      if (!title && !description)
        return interaction.reply({ content: '`❌` `title`と`description`はどちらかは必ず入力する必要があります。', ephemeral: true });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(title)
            .setDescription(description?.replace('  ', '\n') || null)
            .setColor(interaction.options.getNumber('color') ?? Colors.White)
            .setImage(interaction.options.getAttachment('image')?.url || null),
        ],
        components: [...embedCreateButtons],
        ephemeral: true,
      });
    }

    if (subCommand === 'import') {
      await interaction.deferReply({ ephemeral: true });
      const attachment = interaction.options.getAttachment('json', true);

      if (!attachment.contentType?.includes('application/json'))
        return interaction.followUp({ content: '`❌` 添付されたファイルはjsonファイルではありません。', ephemeral: true });
      if (attachment.size > 3000000)
        return interaction.followUp({ content: '`❌` 3MB以上のjsonファイルはインポートできません。', ephemeral: true });

      let json: Array<object> = (await axios.get(attachment.url)).data;
      if (!Array.isArray(json)) json = [json];

      interaction
        .followUp({ embeds: [...json], components: [...embedCreateButtons], ephemeral: true })
        .catch(() => interaction.followUp({ content: '`❌` インポートに失敗しました。 有効なファイルであるか確認してください。', ephemeral: true }));
    }

  },
);

module.exports = [embedCommand];