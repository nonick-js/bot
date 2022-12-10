const { EmbedBuilder, ComponentType, ButtonBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { errorEmbed, failedUpdateEmbed } = require('../../utils/embeds');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-removeField',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed || embed?.fields?.length == 0) return interaction.update({});

    if (embed.fields.length == 1) {
      const button1 = interaction.message.components?.[0];
      const button2 = interaction.message.components?.[1];

      if (
        button1?.components?.[0]?.type !== ComponentType.Button ||
        button2?.components?.[0]?.type !== ComponentType.Button
      ) return interaction.update({});

      const editedEmbed = EmbedBuilder
        .from(embed)
        .setFields([]);

      button2.components[0] = ButtonBuilder
        .from(button2.components[0])
        .setDisabled(false);

      button2.components[1] = ButtonBuilder
        .from(button2.components[1])
        .setDisabled(true);

      return interaction.update({ embeds: [editedEmbed], components: [button1, button2] });
    }

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-removeFieldModal')
      .setTitle('フィールドを削除')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('name')
            .setLabel('削除するフィールドの名前')
            .setMaxLength(256)
            .setStyle(TextInputStyle.Short),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-removeFieldModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed || embed?.fields?.length < 2) return interaction.update({});

    const button1 = interaction.message.components?.[0];
    const button2 = interaction.message.components?.[1];
    if (
      button1?.components?.[0]?.type !== ComponentType.Button ||
      button2?.components?.[0]?.type !== ComponentType.Button
    ) return interaction.update({});

    const name = interaction.fields.getTextInputValue('name');

    const fields = embed.fields;
    const deleteFieldIndex = fields.findIndex(v => v.name == name);

    if (deleteFieldIndex == -1) {
      return interaction.reply({ embeds: [errorEmbed(`名前「${name}」に一致する項目が存在しません`, true)] })
        .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    }

    fields.splice(deleteFieldIndex, 1);

    const editedEmbed = EmbedBuilder
      .from(embed)
      .setFields(fields);

    if (fields.length == 24) {
      button2.components[0] = ButtonBuilder
        .from(button2.components[0])
        .setDisabled(false);
    }

    interaction.update({ embeds: [editedEmbed], components: [button1, button2] }).catch(() => {
      interaction.reply({ embeds: [failedUpdateEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];