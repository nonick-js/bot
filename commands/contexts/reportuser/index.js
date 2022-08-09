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
				.setDescription(language('Report.Common.Embed.NotSetting'))
				.setColor('BLUE');
				if (interaction.member.permissions.has('MANAGE_GUILD')) {
					embed.setDescription(language('Report.Common.Embed.NotSetting_Admin'))
					.setImage(language('Report.Common.Embed.NotSetting_Admin_Image'));
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
				.setDescription(language('Report.Common.Embed.Report.User_undef'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (!member && user.bot && user.discriminator == '0000') {
			const embed = new discord.MessageEmbed()
				.setDescription(language('Report.Common.Embed.Report.Sys'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (user == client.user) {
			return interaction.reply({ content: `${language('Report.Common.Embed.Report.Myself')}`, ephemeral: true });
		}

		if (user.system) {
			const embed = new discord.MessageEmbed()
				.setDescription(language('Report.Common.Embed.Sys'))
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		if (member) {
			if (member == interaction.member) {
				return interaction.reply({ content: `${language('Report.Common.Embed.Report.Yourself')}`, ephemeral: true });
			}
			if (member.permissions.has('MANAGE_MESSAGES')) {
				const embed = new discord.MessageEmbed()
					.setDescription(language('Report.Common.Embed.Report.Admin'))
					.setColor('RED');
				return interaction.reply({ embeds: [embed], ephemeral:true });
			}
		}

		const modal = new discord.Modal()
            .setCustomId('userReport')
            .setTitle(language('Report.UserSlave.Modal.Title'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId(interaction.targetUser.id)
                        .setLabel(language('Report.Common.Modal.Label'))
                        .setPlaceholder(language('Report.Common.Modal.Placeholder'))
                        .setStyle('PARAGRAPH')
                        .setMaxLength(4000)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};