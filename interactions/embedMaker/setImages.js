const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Colors } = require('discord.js');
const { failedUpdateEmbed } = require('../../utils/embeds');
const { isURL } = require('../../utils/functions');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-setImage',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-setImageModal')
      .setTitle('画像')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('thumbnailUrl')
            .setLabel('サムネイル (URL)')
            .setMaxLength(1000)
            .setPlaceholder('指定した画像は右上に表示されます')
            .setValue(embed.thumbnail?.url || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('imageUrl')
            .setLabel('埋め込み内画像 (URL)')
            .setMaxLength(1000)
            .setPlaceholder('指定した画像は下部に表示されます')
            .setValue(embed.image?.url || '')
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
    customId: 'nonick-js:embedMaker-setImageModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) interaction.update({});

    const thumbnailUrl = interaction.fields.getTextInputValue('thumbnailUrl');
    const imageUrl = interaction.fields.getTextInputValue('imageUrl');

    try {
      if (thumbnailUrl && !isURL(imageUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
      if (imageUrl && !isURL(imageUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
    }
    catch (err) {
      const errorEmbed = new EmbedBuilder()
        .setDescription('`❌` ' + err)
        .setColor(Colors.Red)
        .setFooter({ text: '(このメッセージは数秒後に自動で削除されます)' });

      return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply, 3000));
    }

    const editedEmbed = EmbedBuilder
      .from(embed)
      .setThumbnail(thumbnailUrl || null)
      .setImage(imageUrl || null);

    interaction.update({ embeds: [editedEmbed] }).catch(() => {
      interaction.reply({ embeds: [failedUpdateEmbed], ephemeral: true })
        .then(() => setTimeout(() => interaction.deleteReply(), 6000));
    });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];