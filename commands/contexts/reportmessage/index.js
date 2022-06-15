const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'サーバー運営に通報', type: 'MESSAGE' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
		const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const reportCh = config.get('reportCh');

		if (reportCh == null) {
            const embed = new discord.MessageEmbed()
				.setDescription([
					'⚠️ **この機能を使用するには追加で設定が必要です。**',
					'BOTの設定権限を持っている人に連絡してください。',
				].join('\n'))
				.setColor('BLUE');
			if (interaction.member.permissions.has('MANAGE_GUILD')) {
				embed
					.setDescription([
						'⚠️ **この機能を使用するには追加で設定が必要です。**',
						`${discord.Formatters.inlineCode('/setting')}で通報機能の設定を開き、レポートを受け取るチャンネルを設定してください。`,
					].join('\n'))
					.setImage('https://cdn.discordapp.com/attachments/958791423161954445/976117804879192104/unknown.png');
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		/** @type {discord.User} */
		const user = interaction.targetMessage.author;
		/** @type {discord.GuildMember} */
		const member = interaction.guild.members.cache.get(user.id);

		if (!member) {
			const embed = new discord.MessageEmbed()
				.setDescription('❌ そのユーザーはこのサーバーにいません!')
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (user == client.user) return interaction.reply({ content: '僕を通報しても意味ないよ。', ephemeral: true });
		if (user.bot || user.system) {
			const embed = new discord.MessageEmbed()
				.setDescription('❌ BOT、Webhook、システムメッセージを通報することはできません!')
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}
		if (member == interaction.member) return interaction.reply({ content: '自分自身を通報していますよ...', ephemeral: true });
		if (member.permissions.has('MANAGE_MESSAGES')) {
			const embed = new discord.MessageEmbed()
			.setDescription('❌ このコマンドでサーバー運営者を通報することはできません!')
			.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		const reportedMessage = interaction.targetMessage;
		const embed = new discord.MessageEmbed()
			.setTitle('⚠ メッセージを通報')
			.setDescription('このメッセージを通報してもよろしいですか?' + discord.Formatters.codeBlock('markdown', '通報はこのサーバーの運営にのみ送信されます。\n無関係なメッセージの通報や通報の連投は処罰を受ける可能性があります。'))
			.setColor('RED')
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: '投稿者', value: `<@${user.id}>`, inline:true },
				{ name: '投稿先', value: `${reportedMessage.channel} [リンク](${reportedMessage.url})`, inline:true },
			);
		const button = new discord.MessageActionRow().addComponents(
			new discord.MessageButton()
				.setCustomId('messageReport')
				.setLabel('通報')
				.setEmoji('969148338597412884')
				.setStyle('DANGER'),
		);

		if (reportedMessage.content) embed.addFields({ name: 'メッセージ', value: `${reportedMessage.content}` });
		if (reportedMessage.attachments.first()) {
			const reportedMessageFile = reportedMessage.attachments.first();
			if (reportedMessageFile.height && reportedMessageFile.width) embed.setImage(reportedMessageFile.url);
		}
		interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};