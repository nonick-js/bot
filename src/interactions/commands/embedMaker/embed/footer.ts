import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';
import { isURL } from '../../../../module/functions';

const setFooterButton = new Button(
  { customId: 'nonick-js:embedMaker-footer' },
  (interaction): void => {
    const embed = interaction.message.embeds[0];

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-footerModal')
        .setTitle('フッター')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('text')
              .setLabel('テキスト')
              .setMaxLength(2048)
              .setValue(embed.footer?.text || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('iconUrl')
              .setLabel('アイコンのURL')
              .setMaxLength(1000)
              .setValue(embed.footer?.iconURL || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );
  },
);

const setFooterModal = new Modal(
  { customId: 'nonick-js:embedMaker-footerModal' },
  (interaction): void => {
    if (!interaction.isFromMessage()) return;

    const text = interaction.fields.getTextInputValue('text');
    const iconUrl = interaction.fields.getTextInputValue('iconUrl');

    if (!text && iconUrl) {
      interaction.reply({ content: '`❌` アイコンのURLを設定する場合は、テキストも入力する必要があります。', ephemeral: true });
      return;
    }
    else if (iconUrl && !isURL(iconUrl)) {
      interaction.reply({ content: '`❌` `http://`または`https://`から始まるURLを入力してください。', ephemeral: true });
      return;
    }

    interaction
      .update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setFooter({
              text: text || ' ',
              iconURL: iconUrl || undefined,
            }),
        ],
      })
      .catch(() => {
        interaction.reply({ content: '`❌` 埋め込みの更新に失敗しました。埋め込みの制限を超えた可能性があります。', ephemeral: true });
      });
  },
);

module.exports = [setFooterButton, setFooterModal];