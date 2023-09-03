import { APIButtonComponent, APIEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';
import { Emojis } from '../../../module/constant';

export enum embedMakerType {
  send = 'send',
  edit = 'edit',
}

export function getBaseEmbedMakerButtons(embed: APIEmbed | Embed) {
  return [
    new ActionRowBuilder<ButtonBuilder>()
      .setComponents(
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-base')
          .setLabel('基本')
          .setEmoji(Emojis.White.message)
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-image')
          .setLabel('画像')
          .setEmoji(Emojis.White.image)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-author')
          .setLabel('ヘッダー')
          .setEmoji(Emojis.White.nickName)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-footer')
          .setLabel('フッター')
          .setEmoji(Emojis.White.nickName)
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-timeStamp')
          .setEmoji(Emojis.White.schedule)
          .setStyle(ButtonStyle.Secondary),
      ),

    new ActionRowBuilder<ButtonBuilder>()
      .setComponents(
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-addField')
          .setLabel('フィールド')
          .setEmoji(Emojis.White.addMark)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(embed.fields?.length === 25),
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-removeField')
          .setLabel('フィールド')
          .setEmoji(Emojis.White.removeMark)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(!embed.fields?.length),
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-export')
          .setEmoji(Emojis.White.download)
          .setStyle(ButtonStyle.Danger),
      ),
  ];
}

export function getEmbedMakerButtons(embed: APIEmbed | Embed, type: embedMakerType) {
  const actionRows = getBaseEmbedMakerButtons(embed);

  switch (type) {
    case 'send':
      actionRows[1].addComponents(
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-send')
          .setLabel('送信')
          .setStyle(ButtonStyle.Primary),
      );
      break;

    case 'edit':
      actionRows[1].addComponents(
        new ButtonBuilder()
          .setCustomId('nonick-js:embedMaker-edit')
          .setLabel('編集')
          .setStyle(ButtonStyle.Primary),
      );
      break;

    default:
      break;
  }

  return actionRows;
}

export function reloadEmbedMaker(interaction: MessageComponentInteraction | ModalSubmitInteraction, embed: APIEmbed | Embed) {
  if (interaction instanceof ModalSubmitInteraction && !interaction.isFromMessage()) return;

  const components = getBaseEmbedMakerButtons(embed);
  components[1].addComponents(ButtonBuilder.from(interaction.message.components[1].components[3] as APIButtonComponent));

  interaction
    .update({ embeds: [embed], components })
    .catch((e) => interaction.reply({ content: `\`❌\` 埋め込みの更新に失敗しました。\n\`${e}\`` }));
}