const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('[開発中] ユーザーをBANします。')
		.addSubcommand(subcommand => 
			subcommand
				.setName('id')
				.setDescription('ユーザーをIDでBAN')
				.addStringOption(option0 =>
					option0.setName('userid')
						.setDescription('BAN 対象のユーザーID')	
						.setRequired(true)
				)
				.addNumberOption(option2 =>
					option2.setName('delete_messages')	
						.setDescription('最近のメッセージ履歴をどこまで削除するか')
						.addChoice('削除しない', 0)
						.addChoice('過去24時間', 1)
						.addChoice('過去7日', 7)
						.setRequired(true)
				)
				.addStringOption(option3 => 
					option3.setName('reason')
						.setDescription('BANする理由')
				),
		),
	async execute(interaction,client) {
		if (!interaction.member.permissions.has("BAN_MEMBERS")) {
			const embed = new MessageEmbed()
				.setColor('#E84136')
				.setDescription('あなたにはこのコマンドを使用する権限がありません！');
			interaction.reply({embeds: [embed], ephemeral: true});
			return;
		}

		if (interaction.options.getSubcommand() === 'id') {
			const banUser = interaction.options.getString('userid');
			const banDeleteMessage = interaction.options.getNumber('delete_messages');
			let banReason = interaction.options.getString('reason');
			if (!banReason) { banReason = '理由が入力されていません'; }

			try {	
				interaction.guild.members.ban(banUser,{reason: banReason, days: banDeleteMessage})
				interaction.reply(`BANに成功しました`);
			} catch (error) {
				console.log(error)
				const embed = new MessageEmbed()
					.setDescription(`<@${banUser}>をBANできません! BOTより上の権限を持っています!`)
					.setColor('RED');
				interaction.reply({embeds: [embed], ephemeral:true});
			}
		}
    }
}