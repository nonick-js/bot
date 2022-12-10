const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { failedUpdateEmbed, errorEmbed } = require('../../utils/embeds');
const { isURL } = require('../../utils/functions');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-setAuthor',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-setAuthorModal')
      .setTitle('ヘッダー')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('name')
            .setLabel('名前')
            .setMaxLength(256)
            .setValue(embed.author?.name || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('nameUrl')
            .setLabel('名前につけるURL')
            .setMaxLength(1000)
            .setValue(embed.author?.url || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('iconUrl')
            .setLabel('アイコンのURL')
            .setMaxLength(1000)
            .setValue(embed.author?.iconURL || '')
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
    customId: 'nonick-js:embedMaker-setAuthorModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const name = interaction.fields.getTextInputValue('name');
    const nameUrl = interaction.fields.getTextInputValue('nameUrl');
    const iconUrl = interaction.fields.getTextInputValue('iconUrl');

    try {
      if (nameUrl && !isURL(nameUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
      if (iconUrl && !isURL(iconUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
      if (!name && (nameUrl || iconUrl)) throw 'アイコンURLや名前につけるURLを追加する場合は、「名前」オプションも入力する必要があります';
    }
    catch (err) {
      return interaction.reply({ embeds: [errorEmbed(err, true)], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    }

    const editedEmbed = EmbedBuilder
      .from(embed)
      .setAuthor({
        name: name || null,
        url: nameUrl || null,
        iconURL: iconUrl || null,
      });

    interaction.update({ embeds: [editedEmbed], ephemeral: true }).catch(() => {
      interaction.reply({ embeds: [failedUpdateEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 6000));
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];