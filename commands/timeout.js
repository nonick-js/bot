const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('メンバーをタイムアウトします。')
		.addUserOption(option0 =>
			option0.setName('name')
				.setDescription('タイムアウトするユーザーの名前を入力してください。')	
				.setRequired(true)
		)
		.addStringOption(option1 => 
			option1.setName('time')
				.setDescription('タイムアウトする時間を分単位で入力してください。')
				.setRequired(true)
		)
		.addStringOption(option2 =>
			option2.setName('reason')
				.setDescription('タイムアウトする理由を入力してください。')
		),
	async execute(interaction) {
		if (!interaction.member.permissions.has("MODERATE_MEMBERS")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはこの設定を管理する権限がありません！');
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
		const command_string1 = interaction.options.getString('name');
		const command_string2 = interaction.options.getString('time');
		const command_string3 = interaction.options.getString('reason');
    }
}