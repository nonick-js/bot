const fs = require('fs');
const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {name: 'timeout', description: 'ユーザーをタイムアウト 公式のtimeoutコマンドより柔軟な設定が可能です。', type: 'CHAT_INPUT', options: [
        {name: 'user', description: 'タイムアウト対象のユーザー', type: 'USER', required: true},
        {name: 'day', description: 'タイムアウトする時間 (日単位)', type: 'NUMBER', required: true},
        {name: 'minute', description: 'タイムアウトする時間 (分単位)', type: 'NUMBER', required: true},
        {name: 'reason', description: 'タイムアウトする理由', type: 'STRING'}
    ]},
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        if (!interaction.member.permissions.has("MODERATE_MEMBERS")) {
            const embed = new discord.MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはこのコマンドを使用する権限がありません！');
            return interaction.reply({embeds: [embed], ephemeral: true});
        }

		const moderateUserId = interaction.user.id;
		const timeoutUserId = interaction.options.getUser('user').id;
		const timeoutAvaterURL = interaction.options.getUser('user').avatarURL();
		const timeoutMember = interaction.guild.members.cache.get(timeoutUserId);
		const timeoutDuration_d = interaction.options.getNumber('day');
		const timeoutDuration_m = interaction.options.getNumber('minute');
		const bot_id = interaction.guild.me.id;
		let timeoutReason = interaction.options.getString('reason');
		if (timeoutReason == null) timeoutReason = '理由が入力されていません';
		const timeoutDuration = (timeoutDuration_d * 86400000) + (timeoutDuration_m * 60 * 1000);

		if (timeoutDuration > 2419200000) { //28日をこえたら
			const embed = new discord.MessageEmbed()
				.setDescription('⛔ **28日**を超えるタイムアウトはできません!')
				.setColor('RED');
			return interaction.reply({embeds: [embed], ephemeral: true});
		}
		if (timeoutUserId == bot_id) return interaction.reply({content: '私をタイムアウトするだと...?',ephemeral: true});
		if (timeoutMember == undefined) {
			const embed = new discord.MessageEmbed()
				.setDescription('そのユーザーはこのサーバーにいません!')
				.setColor('RED')
			return interaction.reply({embeds: [embed], ephemeral:true});
		}

		timeoutMember.timeout(timeoutDuration)
			.then(async () => {
				interaction.reply({content: `⛔ <@${timeoutUserId}>を` + `**${timeoutDuration_d}日` + `${timeoutDuration_m}分**`+`タイムアウトしました。`, ephemeral:true});
				const config = await Configs.findOne({where: {serverId: interaction.guild.id}});
                const timeoutLog = config.get('reportRoleMention');
                const timeoutDm = config.get('reportRoleMention');
				
				if (timeoutLog) {
        			const timeoutLogCh = config.get('timeoutLogCh');
					const embed = new discord.MessageEmbed()
                        .setTitle('⛔タイムアウト')
                        .setThumbnail(timeoutAvaterURL)
                        .addFields(
                            {name: '処罰を受けた人', value: `<@${timeoutUserId}>`},
                            {name: 'タイムアウトした理由', value: timeoutReason, inline: true},
                            {name: '担当者', value: `<@${moderateUserId}>`}
                        )
                        .setColor('RED');
					client.channels.cache.get(timeoutLogCh).send({embeds: [embed]})
						.catch(() => {
							console.log(`[DiscordBot-NoNick.js]`+'\u001b[31m'+' [ERROR]'+'\u001b[0m'+`[DiscordBot-NoNick.js]` + `\u001b[31m'+' [ERROR]'+'\u001b[0m'+' 指定したチャンネルにタイムアウトログを送れませんでした。「/setting」で正しい・BOTが送信できるチャンネルIDを送信してください。`);
						});
				}
				if (timeoutDm) {
					const timeoutServerIcon = interaction.guild.iconURL();
					const embed = new discord.MessageEmbed()
						.setTitle('⛔タイムアウト')
						.setDescription(`あなたは**${interaction.guild.name}**からタイムアウトされました`)
						.setThumbnail(timeoutServerIcon)
						.setColor('RED')
						.addFields(
							{name: 'タイムアウトされた理由', value: timeoutReason}
					);
					timeoutMember.send({embeds: [embed]}).catch(error => {
						const embed = new discord.MessageEmbed()
							.setDescription('タイムアウトした人への警告DMに失敗しました。\nフレンド以外からのメッセージ受信を拒否しています。')
							.setColor('RED')
						interaction.followUp({embeds: [embed], ephemeral: true});
					});
				}
			})
			.catch(() => {
				const embed = new discord.MessageEmbed()
					.setDescription(`<@${timeoutUserId}> のタイムアウトに失敗しました。\nBOTより上の権限を持っているか、サーバーの管理者です。`)
					.setColor('RED');
				interaction.reply({embeds: [embed], ephemeral:true});
			})
    }
}