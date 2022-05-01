const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ユーザーをIDでBAN')
		.addSubcommand(subcommand => 
			subcommand
				.setName('id')
				.setDescription('ユーザーをIDでBAN')
				.addUserOption(option0 =>
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
			const embed = new discord.MessageEmbed()
				.setColor('#E84136')
				.setDescription('あなたにはこのコマンドを使用する権限がありません！');
			interaction.reply({embeds: [embed], ephemeral: true});
			return;
		}

		if (interaction.options.getSubcommand() === 'id') {
			const moderateUserId = interaction.user.id;
			const banUserId = interaction.options.getUser('userid').id;
			const banUserAvaterURL = interaction.options.getUser('userid').avatarURL();
			const banDeleteMessage = interaction.options.getNumber('delete_messages');
			let banReason = interaction.options.getString('reason');
			if (!banReason) { banReason = '理由が入力されていません'; }

			interaction.guild.members.ban(banUserId,{reason: banReason, days: banDeleteMessage})
				.then(() => {
					interaction.reply({content: `🔨 <@${banUserId}>(` + discord.Formatters.inlineCode(banUserId) + ')をBANしました。', ephemeral:true});
					const { banidLog } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
					if(banidLog) {
						const { banidLogCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
						const embed = new discord.MessageEmbed()
							.setTitle('🔨BAN')
							.setThumbnail(banUserAvaterURL)
							.addFields(
								{name: '処罰を受けた人', value: `<@${banUserId}>(${banUserId})`},
								{name: 'BANした理由', value: banReason, inline: true},
								{name: '担当者', value: `<@${moderateUserId}>`}
							)
							.setColor('RED');
						client.channels.cache.get(banidLogCh).send({embeds: [embed]})
							.catch(() => {
								console.log(`[DiscordBot-NoNick.js]`+'\u001b[31m'+' [ERROR]'+'\u001b[0m'+`[DiscordBot-NoNick.js]` + `\u001b[31m'+' [ERROR]'+'\u001b[0m'+' 指定したチャンネルにBANIDログを送れませんでした。「/setting」で正しい・BOTが送信できるチャンネルIDを送信してください。`);
							});
					}
				})
				.catch((error) => {
					console.log(error)
					const embed = new discord.MessageEmbed()
						.setDescription(`<@${banUserId}>(` + discord.Formatters.inlineCode(banUserId) + `)のBANに失敗しました。\nBOTより上の権限を持っているか、サーバーの管理者です。`)
						.setColor('RED');
					interaction.reply({embeds: [embed], ephemeral:true});
				});
		}
    }
}