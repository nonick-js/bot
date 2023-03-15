import { ActionRowBuilder, ColorResolvable, EmbedBuilder, ModalBuilder, resolveColor, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';
import { isURL } from '../../../module/functions';

const setBasicTextsButton = new Button(
  { customId: 'nonick-js:embedMaker-basic' },
  (interaction) => {

    const embed = interaction.message.embeds[0];

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-basicModal')
        .setTitle('タイトル・説明・色')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('title')
              .setLabel('タイトル')
              .setValue(embed.title || '')
              .setMaxLength(256)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('url')
              .setLabel('タイトルURL')
              .setValue(embed.url || '')
              .setPlaceholder('例）https://docs.nonick-js.com')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('description')
              .setLabel('説明')
              .setValue(embed.description || '')
              .setMaxLength(3999)
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('color')
              .setLabel('カラーコード (または色の名前)')
              .setValue(embed.hexColor || '')
              .setPlaceholder('例）#ffffff, Red')
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );

  },
);

const setBasicTextsModal = new Modal(
  { customId: 'nonick-js:embedMaker-basicModal' },
  (interaction) => {

    if (!interaction.isFromMessage()) return;

    const title = interaction.fields.getTextInputValue('title');
    const url = interaction.fields.getTextInputValue('url');
    const description = interaction.fields.getTextInputValue('description');
    let color: (string | number) = interaction.fields.getTextInputValue('color');

    if (!title && !description)
      return interaction.reply({ content: '`❌` タイトルと説明はどちらかは必ず入力する必要があります。', ephemeral: true });
    if (url && !isURL(url))
      return interaction.reply({ content: '`❌` `http://`または`https://`から始まるURLを入力してください。', ephemeral: true });

    try {
      color = resolveColor(color as ColorResolvable);
    } catch {
      return interaction.reply({ content: '`❌` 無効なカラーコード、または色の名前が入力されました。[このページ](https://docs.nonick-js.com/nonick.js/features/embed/)を参考に正しい値を入力してください。', ephemeral: true });
    }

    interaction
      .update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setTitle(title || null)
            .setURL(url || null)
            .setDescription(description || null)
            .setColor(color),
        ],
      })
      .catch(() => {
        interaction.reply({ content: '`❌` 埋め込みの更新に失敗しました。埋め込みの制限を超えた可能性があります。', ephemeral: true });
      });

  },
);

module.exports = [setBasicTextsButton, setBasicTextsModal];