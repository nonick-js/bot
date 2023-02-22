import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';
import { isURL } from '../../../module/functions';

const setImageButton = new Button(
  { customId: 'nonick-js:embedMaker-image' },
  (interaction): void => {
    const embed = interaction.message.embeds[0];

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-imageModal')
        .setTitle('画像')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('thumbnailUrl')
              .setLabel('サムネイル (URL)')
              .setMaxLength(1000)
              .setPlaceholder('指定した画像は右上に表示されます')
              .setValue(embed.thumbnail?.url || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('imageUrl')
              .setLabel('埋め込み内画像 (URL)')
              .setMaxLength(1000)
              .setPlaceholder('指定した画像は下部に表示されます')
              .setValue(embed.image?.url || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );
  },
);

const setImageModal = new Modal(
  { customId: 'nonick-js:embedMaker-imageModal' },
  (interaction) => {
    if (!interaction.isFromMessage()) return;

    const thumbnailUrl = interaction.fields.getTextInputValue('thumbnailUrl');
    const imageUrl = interaction.fields.getTextInputValue('imageUrl');

    if ((thumbnailUrl && !isURL(thumbnailUrl)) || (imageUrl && !isURL(imageUrl)))
      return interaction.reply({ content: '`❌` `http://`または`https://`から始まるURLを入力してください。', ephemeral: true });

    interaction
      .update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setThumbnail(thumbnailUrl || null)
            .setImage(imageUrl || null),
        ],
      })
      .catch(() => {
        interaction.reply({ content: '`❌` 埋め込みの更新に失敗しました。埋め込みの制限を超えた可能性があります。', ephemeral: true });
      });
  },
);

module.exports = [setImageButton, setImageModal];