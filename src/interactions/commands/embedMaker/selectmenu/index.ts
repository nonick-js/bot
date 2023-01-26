import { Button } from '@akki256/discord-interaction';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { WhiteEmojies } from '../../../../module/emojies';

const selectMenuButton = new Button(
  { customId: 'nonick-js:embedMaker-editEmbedPanel-selectRole' },
  async (interaction): Promise<void> => {

    interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle('ロール付与(セレクトメニュー)の追加')
          .setDescription('下のボタンを使用してセレクトメニューを作成し、「追加」ボタンでメッセージにコンポーネントを追加します。(最大5個まで)'),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:emberMaker-selectRole-edit')
            .setEmoji(WhiteEmojies.pencil)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-addRole')
            .setEmoji(WhiteEmojies.addMark)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-removeRole')
            .setEmoji(WhiteEmojies.removeMark)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-selectMode-single')
            .setLabel('選択：1つのみ')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-sendComponent')
            .setLabel('追加')
            .setStyle(ButtonStyle.Primary),
        ),
      ],
    });

  },
);

module.exports = [selectMenuButton];