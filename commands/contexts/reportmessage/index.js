const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'メッセージを通報', nameLocalizations: { 'en-US': 'Report this message' }, type: 'MESSAGE' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
		const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const reportCh = config.get('reportCh');

		if (reportCh == null) {
            const embed = new discord.MessageEmbed()
				.setDescription(language('REPORTMESSAGE_NOT_SETTING'))
				.setColor('BLUE');
			if (interaction.member.permissions.has('MANAGE_GUILD')) {
				embed.setDescription(language('REPORT_NOT_SETTING_ADMIN'))
					.setImage(language('REPORT_NOT_SETTING_ADMIN_IMAGE'));
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		/** @type {discord.User} */
		const user = interaction.targetMessage.author;
		/** @type {discord.GuildMember} */
		const member = interaction.guild.members.cache.get(user.id);

		if (!member) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('REPORT_MEMBER_UNDEFINED'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (user == client.user) return interaction.reply({ content: `${language('REPORT_MYSELF')}`, ephemeral: true });
		if (user.bot || user.system) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('REPORT_BOT'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}
		if (member == interaction.member) return interaction.reply({ content: `${language('REPORT_YOURSELF')}`, ephemeral: true });
		if (member.permissions.has('MANAGE_MESSAGES')) {
			const embed = new discord.MessageEmbed()
			.setDescription(language('REPORT_ADMIN'))
			.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		/** @type {discord.Message} */
		const reportedMessage = interaction.targetMessage;
		const embed = new discord.MessageEmbed()
			.setTitle(language('REPORT_MESSAGE_EMBED_TITLE'))
			.setDescription(language('REPORT_MESSAGE_EMBED_DESCRIPTION'))
			.setColor('RED')
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: `${language('REPORT_MESSAGE_EMBED_FIELD_1')}`, value: `${user}`, inline:true },
				{ name: `${language('REPORT_MESSAGE_EMBED_FIELD_2')}`, value: `${language('REPORT_MESSAGE_EMBED_FIELD_2_VALUE', [reportedMessage.channel, reportedMessage.url])}`, inline:true },
			);
		const button = new discord.MessageActionRow().addComponents(
			new discord.MessageButton()
				.setCustomId('messageReport')
				.setLabel(language('REPORT_BUTTON_LABEL'))
				.setEmoji('969148338597412884')
				.setStyle('DANGER'),
		);

		if (reportedMessage.content) embed.addFields({ name: `${language('REPORT_MESSAGE_EMBED_FIELD_3')}`, value: `${reportedMessage.content}` });
		if (reportedMessage.attachments.first()) {
			const reportedMessageFile = reportedMessage.attachments.first();
			if (reportedMessageFile.height && reportedMessageFile.width) embed.setImage(reportedMessageFile.url);
		}
		interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};