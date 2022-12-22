const { PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType, ButtonStyle } = require('discord.js');
const { errorEmbed } = require('../utils/embeds');

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
    await interaction.deferReply();
    const content = interaction.options.getString('content');
    const label = interaction.options.getString('label');

    const firstMessage = await interaction.channel.messages.fetch({ after: 1, limit: 1 }).catch(() => {});

    try {
      if (!firstMessage) throw '予期せぬエラーにより、メッセージを取得できませんでした';
      if (!firstMessage?.first()) throw 'このチャンネルにはまだメッセージが1つも投稿されていません';
    } catch (err) {
      return interaction.reply({ embeds: [errorEmbed(err)], ephemeral: true });
    }

    const button = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setLabel(label ?? '最上部へ移動')
        .setURL(firstMessage.first().url || `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${firstMessage.first().id}`)
        .setStyle(ButtonStyle.Link),
    );

    interaction.followUp({
      content: content ?? undefined,
      components: [button],
    });
  },
};
module.exports = [ commandInteraction ];