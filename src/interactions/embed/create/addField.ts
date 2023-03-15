import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';

const addFieldButton = new Button(
  { customId: 'nonick-js:embedMaker-addField' },
  async (interaction) => {

    if (interaction.message.embeds[0].fields.length === 25)
      return interaction.reply({ content: '`❌` これ以上フィールドを追加できません。', ephemeral: true });

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-addFieldModal')
        .setTitle('フィールドを追加')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('name')
              .setLabel('フィールドの名前')
              .setMaxLength(256)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('value')
              .setLabel('フィールドの値')
              .setMaxLength(1024)
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('inline')
              .setLabel('インライン表示にするか')
              .setMaxLength(5)
              .setPlaceholder('trueでON、falseでOFF')
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );

  },
);

const addFieldModal = new Modal(
  { customId: 'nonick-js:embedMaker-addFieldModal' },
  (interaction) => {

    if (!interaction.isFromMessage()) return;

    const embed = interaction.message.embeds[0];
    const name = interaction.fields.getTextInputValue('name');
    const value = interaction.fields.getTextInputValue('value');
    const inline = interaction.fields.getTextInputValue('inline');

    if (!['true', 'false'].includes(inline))
      return interaction.reply({ content: '`❌` `inline`には`true`または`false`のみ入力できます', ephemeral: true });

    interaction
      .update({ embeds: [EmbedBuilder.from(embed).addFields({ name, value, inline: JSON.parse(inline.toLowerCase()) })] })
      .catch(() => interaction.reply({ content: '`❌` 埋め込みの更新に失敗しました。埋め込みの制限を超えた可能性があります。', ephemeral: true }));

  },
);

module.exports = [addFieldButton, addFieldModal];