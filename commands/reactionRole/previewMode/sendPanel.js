const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
  data: {
    customId: 'reactionRole-sendPanel',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const select = interaction.message.components[0];
		const button = interaction.message.components[1];

    try {
      if (select.components[0].type == discord.ComponentType.Button) throw ['まだ一つもロールを追加していません！', null];
      if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) { throw [
        `#${interaction.channel} での ${interaction.client.user.username} の権限が不足しています！`,
        '**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
      ];}
    } catch (err) {
      const error = new discord.EmbedBuilder()
				.setAuthor({ name: err[0], iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setDescription(err[1])
        .setColor('Red');
      return interaction.update({ embeds: [interaction.message.embeds[0], error] });
    }

		if (button.components[3].label == '複数選択') select.components[0] = discord.SelectMenuBuilder.from(select.components[0]).setMaxValues(select.components[0].options.length);

		interaction.channel.send({ embeds: [interaction.message.embeds[0]], components: [select] })
			.then(() => {
				const success = new discord.EmbedBuilder()
					.setDescription('✅ パネルを作成しました!')
					.setColor('Green');
				interaction.update({ content: ' ', embeds: [success], components:[] });
			})
			.catch((err) => {
				const error = new discord.EmbedBuilder()
					.setAuthor({ name: 'エラー！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
					.setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
					.setColor('Red');
				interaction.update({ embeds: [interaction.message.embeds[0], error] });
			});
  },
};

module.exports = [ ping_command ];