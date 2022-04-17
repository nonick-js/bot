const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { userInfo } = require('os');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('ユーザーをタイムアウトします。 公式のtimeoutコマンドより柔軟な設定が可能です。')
		.addUserOption(option0 =>
			option0.setName('user')
				.setDescription('タイムアウトするユーザーの名前を入力してください。')	
				.setRequired(true)
		)
		.addNumberOption(option1 => 
			option1.setName('duration')
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
                .setDescription('あなたにはこのコマンドを使用する権限がありません！');
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
		const command_string1 = interaction.options.getString('user');
		const guildmember = interaction.guild.members.fetch(command_string1);
		const command_string2 = interaction.options.getString('duration');
		const command_string3 = interaction.options.getString('reason').catch(error => {
			console.log("デバッグポイント")
			guildmember.timeout(command_string2 *60 *1000);
		});

    }
}