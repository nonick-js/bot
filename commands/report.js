const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { MessageEmbed, Formatters } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('サーバー運営に通報')
        .setType(ApplicationCommandType.Message),
    async execute(interaction,client) {
		const { reportCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
		if (reportCh == null) {
			if (interaction.member.permissions.has("MANAGE_GUILD")) {
				const embed = new MessageEmbed()
					.setDescription('⚠ **この機能を使用するには追加で設定が必要です。**\n' + Formatters.inlineCode('/setting') + 'で通報機能の設定を開き、受取先を設定してください。')
					.setColor('#526ff5')
				interaction.reply({embeds: [embed], ephemeral:true});
				return;
			} else {
				const embed = new MessageEmbed()
					.setDescription('⚠ **この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。')
					.setColor('#526ff5')
				interaction.reply({embeds: [embed], ephemeral:true});
				return;
			}
		}

		const reportedUser = interaction.targetMessage.author
		if (reportedUser.bot || reportedUser.system) {
			const embed = new MessageEmbed()
				.setDescription('BOT、Webhook、システムメッセージを通報することはできません!')
				.setColor('RED')
			interaction.reply({embeds: [embed], ephemeral:true});
			return;
		}

		const reportedMember = await interaction.guild.members.fetch(interaction.member);
		if (reportedMember == reportMember) {
			interaction.reply({content: '自分自身を通報って...(困惑)', ephemeral:true});
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
				.setLabel('このメッセージはサーバールール等の何に違反していますか?')
				.setPlaceholder('できる限り詳しく入力してください。')
				.setStyle('LONG')
				.setRequired(true)
			);
		showModal(modal, {client, interaction});
    }
}