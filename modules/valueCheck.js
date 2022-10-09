// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @param {discord.Channel} channel
 * @param {discord.Interaction} interaction
 */
function textChannelCheck(channel, interaction) {
  try {
    if (!channel) throw ['その名前のチャンネルが見つかりません！', null];
    if (channel.type !== discord.ChannelType.GuildText) throw ['設定するチャンネルはテキストチャンネルである必要があります！', null];
    if (!channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) { throw [
        `#${channel.name} での ${interaction.client.user.username} の権限が不足しています！`,
        '**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
    ];}
  } catch (err) {
    const error = new discord.EmbedBuilder()
      .setAuthor({ name: err[0], iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
      .setDescription(err[1])
      .setColor('Red');
    return interaction.update({ embeds: [interaction.message.embeds[0], error] });
  }
}

/**
 * @param {discord.Role} role
 * @param {discord.Interaction} interaction
 */
const memberRoleCheck = (role, interaction) => {
  try {
      if (!role) throw 'その名前のロールは存在しません！';
      if (role.managed) throw 'そのロールは外部サービスによって管理されています！';
  } catch (err) {
    const error = new discord.EmbedBuilder()
      .setAuthor({ name: err, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
      .setColor('Red');
    return interaction.update({ embeds: [interaction.message.embeds[0], error] });
  }
};

module.exports = { textChannelCheck, memberRoleCheck };