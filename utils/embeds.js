const { EmbedBuilder, Colors } = require('discord.js');

const failedUpdateEmbed = new EmbedBuilder()
  .setDescription([
    '`❌` **埋め込みの更新に失敗しました**',
    'このエラーが表示される場合、ほとんどは埋め込み全体の文字数がオーバーしていることが原因です。',
    '文字数を減らすか、これ以外が原因とみられる場合は時間を置いて再度お試しください。',
  ].join('\n'))
  .setColor(Colors.Red)
  .setFooter({ text: '(このメッセージは数秒後に自動で削除されます)' });

/**
 * @param {string} err
 * @param {boolean} temporarily
 */
const errorEmbed = (err, temporarily) => {
  const embed = new EmbedBuilder()
    .setDescription('`❌` ' + err)
    .setColor(Colors.Red);

  if (temporarily) return embed.setFooter({ text: '(このメッセージは数秒後に自動で削除されます)' });
  return embed;
};

module.exports = { failedUpdateEmbed, errorEmbed };