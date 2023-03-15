import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const channelModal = new ModalBuilder()
  .setTitle('チャンネル')
  .setComponents(
    new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setCustomId('nameOrId')
        .setLabel('チャンネル名 またはID')
        .setMaxLength(100)
        .setStyle(TextInputStyle.Short),
    ),
  );

export const roleModal = new ModalBuilder()
  .setTitle('ロール')
  .setComponents(
    new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setCustomId('nameOrId')
        .setLabel('チャンネル名 またはID')
        .setMaxLength(100)
        .setStyle(TextInputStyle.Short),
    ),
  );