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
				.setDescription(language('Report.Common.Embed.NotSetting'))
				.setColor('BLUE');
			if (interaction.member.permissions.has('MANAGE_GUILD')) {
				embed.setDescription(language('Report.Common.Embed.NotSetting_Admin'))
					.setImage(language('Report.Common.Embed.NotSetting_Admin_Image'));
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		const user = interaction.targetMessage.author;
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
				.setDescription(language('Report.Common.Embed.Report.Sys'))
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
            .setCustomId('messageReport')
            .setTitle(language('Report.MessageSlave.Modal.Title'))
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId(interaction.targetMessage.id)
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