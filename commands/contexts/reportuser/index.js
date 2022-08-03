const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.UserContextMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'メンバーを通報', nameLocalizations: { 'en-US': 'Report this user' }, type: 'USER' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {

		const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const reportCh = config.get('reportCh');

		if (reportCh == null) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('REPORT_NOT_SETTING'))
				.setColor('BLUE');
				if (interaction.member.permissions.has('MANAGE_GUILD')) {
					embed.setDescription(language('REPORT_NOT_SETTING_ADMIN'))
					.setImage(language('REPORT_NOT_SETTING_ADMIN_IMAGE'));
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		/** @type {discord.User} */
		const user = interaction.targetUser;
		/** @type {discord.GuildMember} */
		// eslint-disable-next-line no-empty-function
		const member = await interaction.guild.members.fetch(user.id).catch(() => {});

		if (!user) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('REPORT_USER_UNDEFINED'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (!member && user.bot && user.discriminator == '0000') {
			const embed = new discord.MessageEmbed()
				.setDescription(language('REPORT_BOT'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (user == client.user) {
			return interaction.reply({ content: `${language('REPORT_MYSELF')}`, ephemeral: true });
		}

		if (user.system) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('REPORT_BOT'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		if (member) {
			if (member == interaction.member) {
				return interaction.reply({ content: `${language('REPORT_YOURSELF')}`, ephemeral: true });
			}

			if (member.permissions.has('MANAGE_MESSAGES')) {
				const embed = new discord.MessageEmbed()
					.setDescription(language('REPORT_ADMIN'))
					.setColor('RED');
				return interaction.reply({ embeds: [embed], ephemeral:true });
			}
		}

		const modal = new discord.Modal()
            .setCustomId('userReport')
            .setTitle(language('REPORT_USER_MODAL_TITLE'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId(interaction.targetUser.id)
                        .setLabel(language('REPORT_MODAL_LABEL'))
                        .setPlaceholder(language('REPORT_MODAL_PLACEHOLDER'))
                        .setStyle('PARAGRAPH')
                        .setMaxLength(4000)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};