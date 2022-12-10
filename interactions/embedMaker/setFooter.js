const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { failedUpdateEmbed, errorEmbed } = require('../../utils/embeds');
const { isURL } = require('../../utils/functions');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-setFooter',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-setFooterModal')
      .setTitle('フッター')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('text')
            .setLabel('テキスト')
            .setMaxLength(2048)
            .setValue(embed.footer?.text || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('iconUrl')
            .setLabel('アイコンのURL')
            .setMaxLength(1000)
            .setValue(embed.footer?.iconURL || '')
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
    customId: 'nonick-js:embedMaker-setFooterModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const text = interaction.fields.getTextInputValue('text');
    const iconUrl = interaction.fields.getTextInputValue('iconUrl');

    try {
      if (!text && iconUrl) throw 'アイコンURLを追加する場合は「テキスト」にも値を入力する必要があります';
      if (iconUrl && !isURL(iconUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
    }
    catch (err) {
      interaction.reply({ embeds: [errorEmbed(err, true)], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    }

    const editedEmbed = EmbedBuilder
      .from(embed)
      .setFooter({
        text: text || null,
        iconURL: iconUrl || null,
      });

    interaction.update({ embeds: [editedEmbed] }).catch(() => {
      interaction.reply({ embeds: [failedUpdateEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];