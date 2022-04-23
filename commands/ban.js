const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, BaseMessageComponent } = require('discord.js');
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
			let membererror;
			const banUser = interaction.options.getString('userid');
			// ユーザーidの形式でないものを弾く
			if (isNaN(banUser) || banUser.length !== 18) {
				const embed = new MessageEmbed()
					.setDescription('ユーザーIDは**18桁の数字**です。\n正しい形式でIDを入力してください。')
					.setColor('RED');
				interaction.reply({embeds: [embed], ephemeral: true});
				return;
			}
			const banmember = interaction.client.users.fetch(banUser).catch(error => {
				membererror = 1;
				console.log('デバッグポイント')
			})

			if (membererror == 1) {

			}
			const banDeleteMessage = interaction.options.getNumber('delete_messages');
			let banReason = interaction.options.getString('reason');
			if (!banReason) { banReason = '理由が入力されていません'; }
			if (!banmember.moderatable) {
				const embed = new MessageEmbed()
					.setDescription(`<@${banUser}>をBANできません! \nBOTより上の権限を持っています!`)
					.setColor('RED');
				interaction.reply({embeds: [embed], ephemeral:true});
				return;
			}

			interaction.guild.members.ban(banUser,{reason: banReason, days: banDeleteMessage});
		}
    }
}