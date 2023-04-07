import { AttachmentBuilder } from 'discord.js';
import { Modal } from '@akki256/discord-interaction';

const modal = new Modal(
  { customId: 'nonick-js:embedMaker-exportModal' },
  async (interaction) => {
    if (!interaction.isFromMessage()) return;

    const targetId = interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await (await interaction.channel?.fetch())?.messages.fetch(targetId || '').catch(() => undefined);
    if (!targetMessage) return interaction.reply({ content: '`❌` メッセージの取得中に問題が発生しました。', ephemeral: true });

    const fileName = interaction.fields.getTextInputValue('fileName') || `nonick-js_embed_${interaction.message.id}`;

    interaction
      .update({
        content: '`✅` 現在の埋め込みをエクスポートしました。`/embed import`を使用して読み込ませることが出来ます。',
        files: [new AttachmentBuilder(Buffer.from(JSON.stringify(targetMessage.embeds, null, 2)), { name: `${fileName}.json` })],
        embeds: [],
        components: [],
      })
      .catch(() => {
        interaction.update({
          content: '`❌` エクスポート中に問題が発生しました。',
          embeds: [],
          components: [],
        });
      });
  },
);

module.exports = [modal];