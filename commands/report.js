const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { MessageEmbed, Formatters, MessageActionRow, MessageButton } = require('discord.js');

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

		const reportedMember = await interaction.guild.members.fetch(reportedUser);
		if (reportedMember == interaction.member) {
			interaction.reply({content: '自分自身を通報って...(困惑)', ephemeral:true});
			return;
		} else if (reportedMember.permissions.has("MANAGE_MESSAGES") ) {
			const embed = new MessageEmbed()
				.setDescription('サーバー運営者を通報することはできません!')
				.setColor('RED');
			interaction.reply({embeds: [embed], ephemeral:true});
			return;
		}

		const embed = new MessageEmbed()
			.setTitle('⚠ メッセージを通報')
			.setDescription('このメッセージを通報してもよろしいですか?\n今はなにもなーい')
			.setColor('RED')
		
		const button = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('report')
				.setLabel('通報')
				.setEmoji('969148338597412884')
				.setStyle('DANGER')
		)
		interaction.reply({embeds: [embed], components: [button], ephemeral:true});
	}
}