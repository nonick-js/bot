import { APIStringSelectComponent, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Emojis } from '../../../module/constant';

export function getRoleSelectMakerButtons(selectMenu?: Partial<APIStringSelectComponent>) {
  return new ActionRowBuilder<ButtonBuilder>().setComponents(
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-selectRole-addRole')
      .setEmoji(Emojis.White.addMark)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selectMenu?.options?.length === 25),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-selectRole-removeRole')
      .setEmoji(Emojis.White.removeMark)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!selectMenu?.options?.length),
    new ButtonBuilder()
      .setCustomId('nonick-js:emberMaker-selectRole-placeholder')
      .setEmoji(Emojis.White.message)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!selectMenu),
    new ButtonBuilder()
      .setCustomId((selectMenu?.max_values || 0) <= 1 ? 'nonick-js:embedMaker-selectRole-selectMode-single' : 'nonick-js:embedMaker-selectRole-selectMode-multi')
      .setLabel((selectMenu?.max_values || 0) <= 1 ? '選択モード：単一' : '選択モード：複数')
      .setStyle(ButtonStyle.Success)
      .setDisabled(!selectMenu),
    new ButtonBuilder()
      .setCustomId('nonick-js:embedMaker-selectRole-sendComponent')
      .setLabel('追加')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!selectMenu),
  );
}