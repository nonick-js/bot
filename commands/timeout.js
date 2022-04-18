const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, IntegrationApplication } = require('discord.js');
const { userInfo } = require('os');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('ユーザーをタイムアウトします。 公式のtimeoutコマンドより柔軟な設定が可能です。')
		.addUserOption(option0 =>
			option0.setName('user')
				.setDescription('タイムアウトするユーザーを選択してください。')	
				.setRequired(true)
		)
		.addNumberOption(option1 =>
			option1.setName('day')
				.setDescription('タイムアウトする時間を日単位で入力してください。')
				.setRequired(true)
		)
		.addNumberOption(option2 => 
			option2.setName('minute')
				.setDescription('タイムアウトする時間を分単位で入力してください。')
				.setRequired(true)
		)
		.addStringOption(option3 =>
			option3.setName('reason')
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
		const timeoutUser = interaction.options.getUser('user').id;
		const timeoutMember = interaction.guild.members.cache.get(timeoutUser);
		const timeoutDuration_d = interaction.options.getNumber('day');
		const timeoutDuration_m = interaction.options.getNumber('minute');
		const timeoutReason = interaction.options.getString('reason');
		const timeoutDuration = (timeoutDuration_d * 60 * 1000 * 24) + (timeoutDuration_m * 60 * 1000);
		console.log(timeoutReason);
		if (timeoutDuration > 40320000) {
			const embed = new MessageEmbed()
				.setDescription('⛔ **28日**を超えるタイムアウトはできません!')
				.setColor('RED');
			interaction.reply({embeds: [embed], ephemeral: true});
			return;
		}
		timeoutMember.timeout(timeoutDuration);
		await interaction.reply({content: `${timeoutUser}のタイムアウトに成功しました。`, ephemeral:true });
    }
}