const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { failedUpdateEmbed, errorEmbed } = require('../../../utils/embeds');
const { toRgb } = require('../../../modules/color');
const { isURL } = require('../../../utils/functions');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-setBasicText',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-setBasicTextModal')
      .setTitle('タイトル・説明・色')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('title')
            .setLabel('タイトル')
            .setMaxLength(1000)
            .setValue(embed?.title || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('titleUrl')
            .setLabel('タイトルにつけるURL')
            .setMaxLength(1000)
            .setValue(embed?.url || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('description')
            .setLabel('説明')
            .setMaxLength(4000)
            .setValue(embed?.description || '')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('color')
            .setLabel('カラーコード')
            .setMaxLength(7)
            .setPlaceholder('#ffffff')
            .setValue(embed.hexColor)
            .setStyle(TextInputStyle.Short),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-setBasicTextModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

		const title = interaction.fields.getTextInputValue('title');
		const titleUrl = interaction.fields.getTextInputValue('titleUrl');
		const description = interaction.fields.getTextInputValue('description');
		const color = interaction.fields.getTextInputValue('color')?.match(new RegExp(/^#[0-9A-Fa-f]{6}$/));

    try {
      if (!title && !description) throw 'タイトル・説明はどちらか片方は入力する必要があります';
      if (!color?.[0]) throw 'カラーコードが無効です。例に従って入力してください';
      if (titleUrl && !isURL(titleUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
    }
    catch (err) {
      return interaction.reply({ embeds: [errorEmbed(err, true)], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 5000));
    }

    const editedEmbed = EmbedBuilder
      .from(embed)
      .setTitle(title || null)
      .setURL(titleUrl || null)
      .setDescription(description || null)
      .setColor(toRgb(color?.[0]));

    interaction.update({ embeds: [editedEmbed] }).catch(() => {
      interaction.reply({ embeds: [failedUpdateEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 6000));
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];