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
        type: 'CHAT_INPUT',
        dmPermission: false,
        defaultMemberPermissions: discord.PermissionFlagsBits.ModerateMembers,
    },
    exec: async (interaction) => {

        /** @type {import('discord.js').GuildMember} */
		// eslint-disable-next-line no-empty-function
		const timeoutMember = await interaction.guild.members.fetch(interaction.options.getUser('user').id).catch(() => {});
		const timeoutDuration = (date.toMS(`${interaction.options.getNumber('day')}d`)) + (date.toMS(`${interaction.options.getNumber('hour')}h`)) + (date.toMS(`${interaction.options.getNumber('minute')}m`));
		const timeoutReason = interaction.options.getString('reason') ?? '理由が入力されていません';

		if (!timeoutMember) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ そのユーザーはこのサーバーにいません！')
                .setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		if (interaction.user.id !== interaction.guild.ownerId && Math.sign(interaction.member.roles.highest.comparePositionTo(timeoutMember.roles.highest)) !== 1) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ 最上位の役職が自分より上か同じメンバーをタイムアウトさせることはできません！')
                .setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (timeoutDuration > date.toMS('28d')) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ 28日を超えるタイムアウトはできません！')
                .setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (timeoutMember.user == interaction.client.user) {
			const embed = new discord.EmbedBuilder()
				.setDescription(`❌ **${interaction.client.user.username}**自身をタイムアウトさせることはできません！`)
				.setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (timeoutMember.user == interaction.user) {
			const embed = new discord.EmbedBuilder()
				.setDescription('❌ 自分自身をタイムアウトしようとしています...')
				.setColor('White');
			return interaction.reply({ embeds: [embed], ephemeral: true });
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
				interaction.reply({ embeds: [embed], ephemeral:true });
			})
			.catch(() => {
				const embed = new discord.EmbedBuilder()
					.setDescription([
						`❌ <@${timeoutMember.id}> (\`${timeoutMember.id}\`)のタイムアウトに失敗しました。`,
						'BOTより上の権限を持っているか、サーバーの管理者です。',
					].join('\n'))
					.setColor('Red');
				interaction.reply({ embeds: [embed], ephemeral:true });
			});
    },
};
module.exports = [ ping_command ];