const discord = require('discord.js');
const date = require('../modules/date');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
    data: {
        name: 'timeout',
        description: 'ユーザーをタイムアウト 公式の機能より柔軟な使用が可能です',
        options: [
            { name: 'user', description: 'ユーザー', type: discord.ApplicationCommandOptionType.User, required: true },
            { name: 'day', description: '時間 (日単位)', type: discord.ApplicationCommandOptionType.Number, required: true },
            { name: 'hour', description: '時間 (時単位)', type: discord.ApplicationCommandOptionType.Number, required: true },
            { name: 'minute', description: '時間 (分単位)', type: discord.ApplicationCommandOptionType.Number, required: true },
            { name: 'reason', description: '理由', type: discord.ApplicationCommandOptionType.String, required: false },
        ],
        dmPermission: false,
        defaultMemberPermissions: discord.PermissionFlagsBits.ModerateMembers,
        type: 'CHAT_INPUT',
    },
    exec: async (interaction) => {
        /** @type {import('discord.js').GuildMember} */
		const timeoutMember = await interaction.guild.members.fetch(interaction.options.getUser('user').id).catch(() => {});
		const timeoutDuration = (date.toMS(`${interaction.options.getNumber('day')}d`)) + (date.toMS(`${interaction.options.getNumber('hour')}h`)) + (date.toMS(`${interaction.options.getNumber('minute')}m`));
		const timeoutReason = interaction.options.getString('reason') ?? '理由が入力されていません';

		try {
			if (!timeoutMember) throw 'そのユーザーはこのサーバーにいません！';
			if (timeoutMember.user == interaction.user) throw '自分自身にコマンドを使用しています...';
			if (timeoutMember.user == interaction.client.user) throw `**${interaction.client.user.username}**自身をタイムアウトすることはできません！`;
			if (!timeoutMember.manageable) throw `そのユーザーは**${interaction.client.user.username}**より権限が強いためタイムアウトできません！`;
			if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(timeoutMember.roles.highest) >= 0) throw '最上位の役職が自分より上か同じメンバーをタイムアウトさせることはできません！';
			if (timeoutDuration > date.toMS('28d')) throw '28日を超えるタイムアウトはできません！';
		} catch (err) {
			const errorEmbed = new discord.EmbedBuilder()
				.setDescription(`❌ ${err}`)
				.setColor('Red');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}

		timeoutMember.timeout(timeoutDuration, timeoutReason + ` by ${interaction.user.tag}`)
			.then(() => {
				const embed = new discord.EmbedBuilder()
					.setDescription([
						`⛔ ${timeoutMember}を**`,
						`\`${Math.floor(timeoutDuration / date.toMS('1d'))}\`日`,
						`\`${Math.floor((timeoutDuration % date.toMS('1d') / date.toMS('1h')))}\`時間`,
						`\`${((timeoutDuration % date.toMS('1d')) % date.toMS('1h')) / date.toMS('1m')}\`分**`,
						'タイムアウトしました。',
					].join(''))
					.setColor('Red');
				interaction.reply({ embeds: [embed], ephemeral: true });
			})
			.catch((err) => {
                const error = new discord.EmbedBuilder()
                    .setTitle('エラー！')
                    .setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
                    .setColor('Red');
				interaction.reply({ embeds: [error], ephemeral: true });
			});
    },
};
module.exports = [ ping_command ];