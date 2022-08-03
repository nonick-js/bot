const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ContextMenuInteraction} interaction
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
				.setDescription(language('REPORT_NOT_SETTING'))
				.setColor('BLUE');
			if (interaction.member.permissions.has('MANAGE_GUILD')) {
				embed.setDescription(language('REPORT_NOT_SETTING_ADMIN'))
					.setImage(language('REPORT_NOT_SETTING_ADMIN_IMAGE'));
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		const user = interaction.targetMessage.author;
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
            .setCustomId('messageReport')
            .setTitle(language('REPORT_MESSAGE_MODAL_TITLE'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId(interaction.targetMessage.id)
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