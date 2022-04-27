const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('サーバー運営に通報')
        .setType(ApplicationCommandType.Message),
    async execute(interaction,client) {
		const reportedUser = interaction.targetMessage.member
		const reportedMember = await interaction.guild.members.fetch(reportedUser);

		if (reportedMember.permissions.has("MANAGE_MESSAGES")) {
			const embed = new MessageEmbed()
				.setDescription('サーバー運営者を通報することはできません!')
				.setColor('RED');
			interaction.reply({embeds: [embed], ephemeral:true});
			return;
		}

        const modal = new Modal()
			.setCustomId('reportModal')
			.setTitle('通報')
			.addComponents(
			new TextInputComponent()
				.setCustomId('textinput')
				.setLabel('このメッセージはサーバールール等の何に違反していますか?詳しい情報を教えてください。')
				.setPlaceholder('できる限り詳しく入力してください。')
				.setStyle('LONG')
				.setRequired(true)
			);
		showModal(modal, {client, interaction});
    }
}