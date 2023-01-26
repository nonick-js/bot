import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';
import { isURL } from '../../../../module/functions';

const setAuthorButton = new Button(
  { customId: 'nonick-js:embedMaker-author' },
  (interaction): void => {
    const embed = interaction.message.embeds[0];

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-authorModal')
        .setTitle('ヘッダー')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('name')
              .setLabel('名前')
              .setMaxLength(256)
              .setValue(embed.author?.name || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('nameUrl')
              .setLabel('名前につけるURL')
              .setMaxLength(1000)
              .setValue(embed.author?.url || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('iconUrl')
              .setLabel('アイコンのURL')
              .setMaxLength(1000)
              .setValue(embed.author?.iconURL || '')
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
      ),
    );
  },
);

const setAuthorModal = new Modal(
  { customId: 'nonick-js:embedMaker-authorModal' },
  (interaction): void => {
    if (!interaction.isFromMessage()) return;

    const name = interaction.fields.getTextInputValue('name');
    const nameUrl = interaction.fields.getTextInputValue('nameUrl');
    const iconUrl = interaction.fields.getTextInputValue('iconUrl');

    if (!name && (nameUrl || iconUrl)) {
      interaction.reply({ content: '`❌` アイコンURLや名前につけるURLを追加する場合は、「名前」オプションも入力する必要があります', ephemeral: true });
      return;
    }
    else if ((nameUrl && !isURL(nameUrl)) || (iconUrl && !isURL(iconUrl))) {
      interaction.reply({ content: '`❌` `http://`または`https://`から始まるURLを入力してください。', ephemeral: true });
      return;
    }

    interaction
      .update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setAuthor({
              name: name || ' ',
              url: nameUrl || undefined,
              iconURL: iconUrl || undefined,
            }),
        ],
      })
      .catch(() => {
        interaction.reply({ content: '`❌` 埋め込みの更新に失敗しました。埋め込みの制限を超えた可能性があります。', ephemeral: true });
      });
  },
);

module.exports = [setAuthorButton, setAuthorModal];