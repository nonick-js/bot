const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, EmbedBuilder, Colors, ButtonStyle } = require('discord.js');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'firstmessage',
    description: 'チャンネルの最初に投稿されたメッセージのリンクボタンを送信します',
    options: [
      {
        name: 'content',
        description: 'メッセージ',
        maxLength: 200,
        type: ApplicationCommandOptionType.String,
      },
      {
        name: 'label',
        description: 'ボタンの名前',
        maxLength: 50,
        type: ApplicationCommandOptionType.String,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages,
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const content = interaction.options.getString('content');
    const label = interaction.options.getString('label');

    const firstMessage = await interaction.channel.messages.fetch({ after: 1, limit: 1 }).catch(() => {});

    if (!firstMessage) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` このチャンネルにはまだメッセージが1つも投稿されていません！')
        .setColor(Colors.Red);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(label ?? '最上部へ移動')
        .setURL(firstMessage.first().url || `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${firstMessage.first().id}`)
        .setStyle(ButtonStyle.Link),
    );

    interaction.reply({
      content: content ?? '下のボタンをクリックすると、このチャンネルの最初のメッセージへ移動します',
      components: [button],
    });
  },
};
module.exports = [ commandInteraction ];