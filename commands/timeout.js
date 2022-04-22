const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('ユーザーをタイムアウト 公式のtimeoutコマンドより柔軟な設定が可能です。')
		.addUserOption(option0 =>
			option0.setName('user')
				.setDescription('タイムアウト対象のユーザー')	
				.setRequired(true)
		)
		.addNumberOption(option1 =>
			option1.setName('day')
				.setDescription('タイムアウトする時間 (日単位)')
				.setRequired(true)
		)
		.addNumberOption(option2 => 
			option2.setName('minute')
				.setDescription('タイムアウトする時間 (分単位)')
				.setRequired(true)
		)
		.addStringOption(option3 =>
			option3.setName('reason')
				.setDescription('タイムアウトする理由')
		),
	async execute(interaction) {
		if (!interaction.member.permissions.has("MODERATE_MEMBERS")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはこのコマンドを使用する権限がありません！');
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
		const moderateUserId = interaction.user.id;
		const timeoutUserModerate = interaction.options.getUser('user').moderatable
		const timeoutUserId = interaction.options.getUser('user').id;
		const timeoutAvaterURL = interaction.options.getUser('user').avatarURL();
		const timeoutMember = interaction.guild.members.cache.get(timeoutUserId);
		const timeoutDuration_d = interaction.options.getNumber('day');
		const timeoutDuration_m = interaction.options.getNumber('minute');
		const bot_id = interaction.guild.me.id;
		let timeoutReason = interaction.options.getString('reason');
		if (timeoutReason == null) {
			timeoutReason = '理由が入力されていません';
		}
		const timeoutDuration = (timeoutDuration_d * 86400000) + (timeoutDuration_m * 60 * 1000);

		if (timeoutDuration > 2419200000) { //28日をこえたら
			const embed = new MessageEmbed()
				.setDescription('⛔**28日**を超えるタイムアウトはできません!')
				.setColor('RED');
			interaction.reply({embeds: [embed], ephemeral: true});
			return;
		}

		if (timeoutUserId == bot_id) {
			interaction.reply({content: '私をタイムアウトするだと...?',ephemeral: true});
			return;
		}
		
		if (!timeoutUserModerate) {
			interaction.reply({content: `<@${timeoutUserId}> のタイムアウトに失敗しました。BOTより強い権限を持っている可能性があります。`, ephemeral: true});
			return;
		}

		timeoutMember.timeout(timeoutDuration);
		interaction.reply(`⛔<@${timeoutUserId}>を` + `**${timeoutDuration_d}日` + `${timeoutDuration_m}分**`+`タイムアウトしました。`);
		const { timeoutLog, timeoutDm } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
	
		if (timeoutLog) {
			const { timeoutLogCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			const embed = new MessageEmbed()
			.setTitle('⛔タイムアウト')
			.setThumbnail(timeoutAvaterURL)
			.addFields(
				{name: '処罰を受けた人', value: `<@${timeoutUserId}>`},
				{name: 'タイムアウトした理由', value: timeoutReason, inline: true},
				{name: '担当者', value: `<@${moderateUserId}>`}
			)
			.setColor('RED');
			await interaction.guild.channels.cache.get(timeoutLogCh).send({embeds: [embed]}).catch(error => {
				console.log(`[DiscordBot-NoNick.js]`+'\u001b[31m'+' [ERROR]'+'\u001b[0m'+`[DiscordBot-NoNick.js]` + `\u001b[31m'+' [ERROR]'+'\u001b[0m'+' 指定したチャンネルにタイムアウトログを送れませんでした。「/setting」で正しい・BOTが送信できるチャンネルIDを送信してください。`);
			});
		}
	
		if (timeoutDm) {
			const { timeoutDmString } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			const timeoutServerIcon = interaction.guild.iconURL();
			const embed = new MessageEmbed()
				.setTitle('⛔タイムアウト')
				.setDescription(timeoutDmString)
				.setThumbnail(timeoutServerIcon)
				.setColor('RED')
				.addFields(
					{name: 'タイムアウトされた理由', value: timeoutReason}
			);
			timeoutMember.send({embeds: [embed]}).catch(error => {
				interaction.followUp({content: 'タイムアウトした人へのDMに失敗しました。', ephemeral: true});
			});
		}
	}
}