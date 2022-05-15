const fs = require('fs');
const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {name: 'メンバーを通報', type: 'USER'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
		const reportedUser = interaction.targetUser;
		const config = await Configs.findOne({where: {serverId: interaction.guild.id}});
        const reportCh = config.get('reportCh');
		if (reportCh == null) {
            const embed = new discord.MessageEmbed()
				.setDescription('⚠ **この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。')
				.setColor('#526ff5')
			if (interaction.member.permissions.has("MANAGE_GUILD")) embed.setDescription('⚠ **この機能を使用するには追加で設定が必要です。**\n' + discord.Formatters.inlineCode('/setting') + 'で通報機能の設定を開き、レポートを受け取るチャンネルを設定してください。');
			return interaction.reply({embeds: [embed], ephemeral:true});
		}

		if (reportedUser.bot || reportedUser.system) {
			const embed = new discord.MessageEmbed()
				.setDescription('BOT、Webhook、システムメッセージを通報することはできません!')
				.setColor('RED')
			return interaction.reply({embeds: [embed], ephemeral:true});
		}

		const reportedMember = await interaction.guild.members.fetch(reportedUser);
		if (reportedMember == interaction.member) return interaction.reply({content: '自分自身を通報って...(困惑)', ephemeral:true});
		if (reportedMember.permissions.has("MANAGE_MESSAGES") ) {
			const embed = new discord.MessageEmbed()
				.setDescription('このコマンドでサーバー運営者を通報することはできません!')
				.setColor('RED');
			return interaction.reply({embeds: [embed], ephemeral:true});
		}

		const embed = new discord.MessageEmbed()
			.setTitle('⚠ メンバーを通報')
			.setDescription('このメンバーを通報してもよろしいですか?' + discord.Formatters.codeBlock('markdown','通報はこのサーバーの運営にのみ送信されます。\n無関係なユーザーの通報や通報の連投は処罰を受ける可能性があります。'))
			.setColor('RED')
			.setThumbnail(reportedUser.displayAvatarURL())
			.addFields(
				{name: "対象者", value: `${reportedUser}`, inline:true},
			)
		const button = new discord.MessageActionRow().addComponents(
			new discord.MessageButton()
				.setCustomId('reportUser')
				.setLabel('通報')
				.setEmoji('969148338597412884')
				.setStyle('DANGER')
		)
		interaction.reply({embeds: [embed], components: [button], ephemeral:true});
    }
}