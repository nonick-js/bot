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
		const reportedUser = interaction.targetMessage.author
		const reportedMember = await interaction.guild.members.fetch(reportedUser);
		console.log(client.user)

		if (reportedMember == interaction.member) {
			interaction.reply({content: '自分自身を通報って...(困惑)', ephemeral:true});
			return;
		} else if (reportedUser.bot || reportedUser.system) {
			const embed = new MessageEmbed()
				.setDescription('BOT、Webhook、システムメッセージを通報することはできません!')
				.setColor('RED')
			interaction.reply({embeds: [embed], ephemeral:true});
			return;
		} else if (reportedMember.permissions.has("MANAGE_MESSAGES") ) {
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