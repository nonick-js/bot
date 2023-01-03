const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { failedUpdateEmbed } = require('../../../utils/embeds');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-addField',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed || embed?.fields?.length == 25) return interaction.update({});

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-addFieldModal')
      .setTitle('フィールドを追加')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('name')
            .setLabel('フィールドの名前')
            .setMaxLength(256)
            .setStyle(TextInputStyle.Short),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('value')
            .setLabel('フィールドの値')
            .setMaxLength(1024)
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-addFieldModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    const button1 = interaction.message.components?.[0];
    const button2 = interaction.message.components?.[1];

    if (
      !embed ||
      embed?.fields == 25 ||
      button1?.components[0]?.type !== ComponentType.Button ||
      button2?.components[0]?.type !== ComponentType.Button
    ) return interaction.update({});

    const name = interaction.fields.getTextInputValue('name');
    const value = interaction.fields.getTextInputValue('value');

    const editedEmbed = EmbedBuilder
      .from(embed)
      .addFields({
        name: name,
        value: value,
      });

    if (editedEmbed.data.fields.length == 1) {
      button2.components[1] = ButtonBuilder
        .from(button2.components[1])
        .setDisabled(false);
    }

    if (editedEmbed.data.fields.length == 25) {
      button2.components[0] = ButtonBuilder
        .from(button2.components[0])
        .setDisabled(true);
    }

    interaction.update({ embeds: [editedEmbed], components: [button1, button2] }).catch((err) => {
      console.log(err);
      interaction.reply({ embeds: [failedUpdateEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 6000));
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];