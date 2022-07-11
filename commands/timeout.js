const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.CommandInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'timeout', description: 'ユーザーをタイムアウト 公式のtimeoutコマンドより柔軟な設定が可能です。', descriptionLocalizations: { 'en-US': 'Timeout a user. More flexible than the official timeout command.' }, type: 'CHAT_INPUT', options: [
        { name: 'user', description: 'ユーザー', descriptionLocalizations: { 'en-US': 'User' }, type: 'USER', required: true },
        { name: 'day', description: 'タイムアウトする時間 (日単位)', descriptionLocalizations: { 'en-US': 'time to time out (in days)' }, type: 'NUMBER', required: true },
        { name: 'minute', description: 'タイムアウトする時間 (分単位)', descriptionLocalizations: { 'en-US': 'time to time out (in minutes)' }, type: 'NUMBER', required: true },
        { name: 'reason', description: 'タイムアウトする理由', descriptionLocalizations: { 'en-US': 'reason' }, type: 'STRING' },
    ] },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
		const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
		const { timeoutLog, timeoutLogCh, timeoutDm } = config.get();

        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            const embed = new discord.MessageEmbed()
				.setDescription(language('TIMEOUT_PERMISSION_ERROR'))
				.setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

		/** @type {discord.User} */
		const moderateUser = interaction.user;
		/** @type {discord.GuildMember} */
		const timeoutMember = interaction.guild.members.cache.get(interaction.options.getUser('user').id);

		const timeoutReason = interaction.options.getString('reason') ?? language('TIMEOUT_REASON_NONE');
		const timeoutDuration_d = interaction.options.getNumber('day');
		const timeoutDuration_m = interaction.options.getNumber('minute');
		const timeoutDuration = (timeoutDuration_d * 86400000) + (timeoutDuration_m * 60000);

		if (!timeoutMember) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('TIEMOUT_MEMBER_UNDEFINED'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}
		if (moderateUser.id !== interaction.guild.ownerId && !(interaction.member.roles.highest.comparePositionTo(timeoutMember.roles.highest) <= 1)) {
			const embed = new discord.MessageEmbed()
				.setDescription()
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (timeoutDuration > 2419000000) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('TIMEOUT_ROLE_ERROR'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
		if (timeoutMember == interaction.guild.me) return interaction.reply({ content: `${language('TIMEOUT_MYSELF')}`, ephemeral: true });

		timeoutMember.timeout(timeoutDuration, timeoutReason)
			.then(() => {
				interaction.reply({ content: `${language('TIMEOUT_RESULT', [timeoutMember, Math.floor(timeoutDuration / 86400000), Math.floor((timeoutDuration % 86400000) / 60000) ])}`, ephemeral:true });
				if (timeoutLog) {
					const embed = new discord.MessageEmbed()
                        .setTitle(language('TIMEOUT_LOG_EMBED_TITLE'))
                        .setThumbnail(timeoutMember.displayAvatarURL())
                        .addFields(
                            { name: `${language('TIMEOUT_LOG_EMBED_FIELD_1')}`, value: `${timeoutMember}(\`${timeoutMember.id}\`)` },
							{ name: `${language('TIMEOUT_LOG_EMBED_FIELD_2')}`, value: `${discord.Formatters.time(timeoutMember.communicationDisabledUntilTimestamp / 1000, 'f')}` },
                            { name: `${language('TIMEOUT_LOG_EMBED_FIELD_3')}`, value: timeoutReason },
                        )
                        .setColor('RED')
                        .setFooter({ text: `${language('TIMEOUT_LOG_EMBED_FOOTER', moderateUser.tag)}`, iconURL: moderateUser.displayAvatarURL() });

					interaction.guild.channels.fetch(timeoutLogCh)
						.then((channel) => channel.send({ embeds: [embed] }).catch(() => Configs.update({ timeoutLog: false, timeoutLogCh: null }, { where: { serverId: interaction.guildId } })))
						.catch(() => Configs.update({ timeoutLog: false, timeoutLogCh: null }, { where: { serverId: interaction.guildId } }));
				}
				if (timeoutDm) {
					const embed = new discord.MessageEmbed()
						.setTitle(language('TIMEOUT_DM_EMBED_TITLE'))
						.setDescription(language('TIMEOUT_DM_DESCRIPTION', interaction.guild.name))
						.setThumbnail(interaction.guild.iconURL())
						.setColor('RED')
						.addFields(
							{ name: `${language('TIMEOUT_DM_EMBED_FIELD_1')}`, value: `${discord.Formatters.time(timeoutMember.communicationDisabledUntilTimestamp / 1000, 'f')}` },
							{ name: `${language('TIMEOUT_DM_EMBED_FIELD_2')}`, value: timeoutReason },
					);
					timeoutMember.user.send({ embeds: [embed] })
						.catch(() => {
							const error = new discord.MessageEmbed()
								.setDescription(language('TIMEOUT_DM_SEND_ERROR'))
								.setColor('RED');
							interaction.followUp({ embeds: [error], ephemeral: true });
						});
				}
			}).catch(() => {
				const embed = new discord.MessageEmbed()
					.setDescription(language('TIMEOUT_ERROR', timeoutMember.id))
					.setColor('RED');
				interaction.reply({ embeds: [embed], ephemeral:true });
			});
    },
};