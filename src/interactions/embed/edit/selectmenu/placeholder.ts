import { Button, Modal } from '@akki256/discord-interaction';
import { ActionRowBuilder, ComponentType, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const selectEditButton = new Button(
  { customId: 'nonick-js:emberMaker-selectRole-placeholder' },
  (interaction) => {

    const select = interaction.message.components[0].components[0];

    if (select.type !== ComponentType.StringSelect)
      return interaction.reply({ content: '`❌` セレクトメニューを編集するにはロールを追加する必要があります。', ephemeral: true });

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:emberMaker-selectRole-placeholderModal')
        .setTitle('セレクトメニューの編集')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('placeholder')
              .setLabel('セレクトメニューのプレースホルダー')
              .setValue(select.placeholder ?? '')
              .setMaxLength(20)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );

  },
);

const selectEditModal = new Modal(
  { customId: 'nonick-js:emberMaker-selectRole-placeholderModal' },
  (interaction) => {

    if (!interaction.isFromMessage()) return;

    const select = interaction.message?.components[0].components[0];
    const buttons = interaction.message?.components[1];
    const placeholder = interaction.fields.getTextInputValue('placeholder');

    if (select?.type !== ComponentType.StringSelect)
      return interaction.reply({ content: '`❌` セレクトメニューを編集するにはロールを追加する必要があります。', ephemeral: true });

    interaction.update({
      content: null,
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          StringSelectMenuBuilder
            .from(select)
            .setPlaceholder(placeholder),
        ),
        buttons,
      ],
    });

  },
);

module.exports = [selectEditButton, selectEditModal];