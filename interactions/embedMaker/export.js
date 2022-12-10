const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, AttachmentBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-export',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-exportModal')
      .setTitle('エクスポート')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('fileName')
            .setLabel('ファイルの名前 (日本語は使用できません)')
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-exportModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    await interaction.deferReply({ ephemeral: true });

    const japaneseRegex = new RegExp(/[\u{3000}-\u{301C}\u{3041}-\u{3093}\u{309B}-\u{309E}]/mu);
    const fileName = interaction.fields.getTextInputValue('fileName');

    const file = new AttachmentBuilder()
      .setName(fileName?.match(japaneseRegex) || `embed_${interaction.message.id}` + '.json')
      .setFile(Buffer.from(JSON.stringify(embed.toJSON(), null, 2)));

    interaction.followUp({
      content: '`✅` 現在の埋め込みをエクスポートしました。`/embed import`を使用して読み込ませることができます。',
      files: [file],
    })
    .catch(() => {
      interaction.followUp({
        embeds: [errorEmbed('ファイル生成に失敗しました。時間を置いて再度お試しください')],
        ephemeral: true });
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];