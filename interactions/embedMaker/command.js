const axios = require('axios');
const { ApplicationCommandOptionType, Colors, PermissionFlagsBits, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
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
            maxLength: 1000,
            type: ApplicationCommandOptionType.String,
            required: true,
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
            ],
          },
          {
            name: 'attachment',
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
            description: 'JSONファイル',
            type: ApplicationCommandOptionType.Attachment,
            required: true,
          },
        ],
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const button1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-setBasicText')
        .setLabel('基本')
        .setEmoji('966596708458983484')
				.setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-setImage')
        .setLabel('画像')
        .setEmoji('1018167020824576132')
				.setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-setAuthor')
        .setLabel('ヘッダー')
        .setEmoji('1005688190931320922')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-setFooter')
        .setLabel('フッター')
        .setEmoji('1005688190931320922')
        .setStyle(ButtonStyle.Secondary),
      );

    const button2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-addField')
        .setLabel('フィールド')
        .setEmoji('988439798324817930')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-removeField')
        .setLabel('フィールド')
        .setEmoji('989089271275204608')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-export')
        .setEmoji('1018760839743950909')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('nonick-js:embedMaker-sendEmbed')
        .setLabel('送信')
        .setStyle(ButtonStyle.Primary),
    );

    const subCommand = interaction.options.getSubcommand();

    if (subCommand == 'create') {
      const title = interaction.options.getString('title');
      const color = interaction.options.getNumber('color');
      const attachment = interaction.options.getAttachment('attachment');

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(color || Colors.White)
        .setImage(attachment?.url || null);

      interaction.reply({
        content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルに埋め込みを送信します',
        embeds: [embed],
        components: [button1, button2],
        ephemeral: true,
      });
    }

    if (subCommand == 'import') {
      await interaction.deferReply({ ephemeral: true });
			const attachment = interaction.options.getAttachment('json');

      try {
        if (attachment.contentType !== 'application/json; charset=utf-8') throw 'jsonファイルをインポートしてください';
        if (attachment.size > 3000000) throw '3MB以上のjsonファイルはインポートできません';
      }
      catch (err) {
        const embed = new EmbedBuilder()
          .setDescription('`❌` ' + err)
          .setColor(Colors.Red);

        return interaction.followUp({ embeds: [embed] });
      }

      const embedJson = await axios.get(attachment.url).catch(() => {});

      button2.components[0] = ButtonBuilder
        .from(button2.components[0])
        .setDisabled(embedJson?.data?.fields?.length == 25);

      button2.components[1] = ButtonBuilder
        .from(button2.components[1])
        .setDisabled(embedJson?.data?.fields?.length == 0);

      interaction.followUp({
        content: '**プレビューモード**\n「送信」ボタンを押すとこのチャンネルに埋め込みを送信します',
        embeds: [embedJson.data],
        components: [button1, button2],
      })
      .catch(() => {
        const errorEmbed = new EmbedBuilder()
          .setDescription([
            '`❌` インポートに失敗しました！',
            '[埋め込みの制限](https://discordjs.guide/popular-topics/embeds.html#embed-limits)に違反していないか、有効なファイルであるか確認してください。',
          ].join('\n'))
          .setColor(Colors.Red);

        interaction.followUp({ embeds: [errorEmbed] });
      });
    }
  },
};

module.exports = [ commandInteraction ];