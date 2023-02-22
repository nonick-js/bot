import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { WhiteEmojies } from '../../../module/emojies';

const baseButton1 = new ActionRowBuilder<ButtonBuilder>()
  .setComponents(
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-basic')
      .setLabel('基本')
      .setEmoji(WhiteEmojies.message)
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-image')
      .setLabel('画像')
      .setEmoji(WhiteEmojies.image)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-author')
      .setLabel('ヘッダー')
      .setEmoji(WhiteEmojies.nickName)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-footer')
      .setLabel('フッター')
      .setEmoji(WhiteEmojies.nickName)
      .setStyle(ButtonStyle.Secondary),
  );

const baseButton2 = new ActionRowBuilder<ButtonBuilder>()
  .setComponents(
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-addField')
      .setLabel('フィールド')
      .setEmoji(WhiteEmojies.addMark)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-removeField')
      .setLabel('フィールド')
      .setEmoji(WhiteEmojies.removeMark)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-timeStamp')
      .setEmoji(WhiteEmojies.schedule)
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-export')
      .setEmoji(WhiteEmojies.download)
      .setStyle(ButtonStyle.Danger),
  );

export const embedCreateButtons: ActionRowBuilder<ButtonBuilder>[] = [
  baseButton1,
  ActionRowBuilder.from(baseButton2).addComponents(
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-send')
      .setLabel('送信')
      .setStyle(ButtonStyle.Primary),
  ) as ActionRowBuilder<ButtonBuilder>,
];

export const embedEditButtons: ActionRowBuilder<ButtonBuilder>[] = [
  baseButton1,
  ActionRowBuilder.from(baseButton2).addComponents(
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-edit')
      .setLabel('編集')
      .setStyle(ButtonStyle.Primary),
  ) as ActionRowBuilder<ButtonBuilder>,
];