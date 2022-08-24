const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.CommandInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'timeout', description: 'ユーザーをタイムアウト 公式のtimeoutコマンドより柔軟な設定が可能です。', descriptionLocalizations: { 'en-US': 'Timeout a user. More flexible than the official timeout command.' }, type: 'CHAT_INPUT', options: [
        { name: 'user', description: 'ユーザー', descriptionLocalizations: { 'en-US': 'User' }, type: 'USER', required: true },
        { name: 'day', description: 'タイムアウトする時間 (日単位)', descriptionLocalizations: { 'en-US': 'time to time out (in days)' }, type: 'NUMBER', required: true },
        { name: 'minute', description: 'タイムアウトする時間 (分単位)', descriptionLocalizations: { 'en-US': 'time to time out (in minutes)' }, type: 'NUMBER', required: true },
        { name: 'reason', description: 'タイムアウトする理由', descriptionLocalizations: { 'en-US': 'reason' }, type: 'STRING' },
    ] },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {

		const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
		const { timeoutLog, timeoutLogCh, timeoutDm } = config.get();

		const errorEmbed = new discord.MessageEmbed().setColor('RED');

        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            errorEmbed.setDescription('❌ あなたにはこのコマンドを使用する権限がありません！\n必要な権限: `メンバーをタイムアウト`');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

		/** @type {discord.User} */
		const moderateUser = interaction.user;
		/** @type {discord.GuildMember} */
		const timeoutMember = interaction.guild.members.cache.get(interaction.options.getUser('user').id);

		const timeoutReason = interaction.options.getString('reason') ?? '理由が入力されていません';
		const timeoutDuration_d = interaction.options.getNumber('day');
		const timeoutDuration_m = interaction.options.getNumber('minute');
		const timeoutDuration = (timeoutDuration_d * 86400000) + (timeoutDuration_m * 60000);

		if (!timeoutMember) {
			errorEmbed.setDescription('❌ そのユーザーはこのサーバーにいません!');
			return interaction.reply({ embeds: [errorEmbed], ephemeral:true });
		}
		if (moderateUser.id !== interaction.guild.ownerId && !(interaction.member.roles.highest.comparePositionTo(timeoutMember.roles.highest) <= 1)) {
			errorEmbed.setDescription('❌ 最上位の役職が自分より上か同じメンバーをタイムアウトさせることはできません!');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
		if (timeoutDuration > 2419000000) {
			errorEmbed.setDescription('❌ 28日を超えるタイムアウトはできません!');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}
		if (timeoutMember == interaction.guild.me) return interaction.reply({ content: '代わりに君をタイムアウトしようかな?', ephemeral: true });

		timeoutMember.timeout(timeoutDuration, timeoutReason)
			.then(() => {
				interaction.reply({ content: `⛔ ${timeoutMember}を**\`${Math.floor(timeoutDuration / 86400000)}\`日\`${Math.floor((timeoutDuration % 86400000) / 60000)}\`分**タイムアウトしました。`, ephemeral:true });

				if (timeoutLog) {
					const embed = new discord.MessageEmbed()
                        .setTitle('⛔ タイムアウト')
                        .setThumbnail(timeoutMember.displayAvatarURL())
                        .addFields(
                            { name: '処罰を受けた人', value: `${timeoutMember}(\`${timeoutMember.id}\`)` },
							{ name: 'タイムアウトが解除される時間', value: `${discord.Formatters.time(timeoutMember.communicationDisabledUntilTimestamp / 1000, 'f')}` },
                            { name: 'タイムアウトした理由', value: timeoutReason },
                        )
                        .setColor('RED')
                        .setFooter({ text: `コマンド使用者: ${moderateUser.tag}`, iconURL: moderateUser.displayAvatarURL() });

					interaction.guild.channels.fetch(timeoutLogCh)
						.then((channel) => channel.send({ embeds: [embed] }).catch(() => Configs.update({ timeoutLog: false, timeoutLogCh: null }, { where: { serverId: interaction.guildId } })))
						.catch(() => Configs.update({ timeoutLog: false, timeoutLogCh: null }, { where: { serverId: interaction.guildId } }));
				}

				if (timeoutDm) {
					const embed = new discord.MessageEmbed()
						.setTitle('⛔ タイムアウト')
						.setDescription(`あなたは**${interaction.guild.name}**からタイムアウトされました。`)
						.setThumbnail(interaction.guild.iconURL())
						.setColor('RED')
						.addFields(
							{ name: 'タイムアウトが解除される時間', value: `${discord.Formatters.time(timeoutMember.communicationDisabledUntilTimestamp / 1000, 'f')}` },
							{ name: 'タイムアウトされた理由', value: timeoutReason },
					);

					timeoutMember.user.send({ embeds: [embed] })
						.catch(() => {
							const error = new discord.MessageEmbed()
								.setDescription('⚠️ タイムアウトした人への警告DMに失敗しました。メッセージ受信を拒否しています。')
								.setColor('RED');
							interaction.followUp({ embeds: [error], ephemeral: true });
						});
				}
			}).catch(() => {
				const embed = new discord.MessageEmbed()
					.setDescription([
						`❌ <@${timeoutMember.id}> (\`${timeoutMember.id}\`)のタイムアウトに失敗しました。`,
						'BOTより上の権限を持っているか、サーバーの管理者です。',
					].join('\n'))
					.setColor('RED');
				interaction.reply({ embeds: [embed], ephemeral:true });
			});
    },
};