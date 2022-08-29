// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const date = require('../../modules/date');

/** @type {import('@djs-tools/interactions').UserRegister} */
const ping_command = {
    data: {
        name: '緊急タイムアウト',
        dmPermission: false,
        defaultMemberPermissions: discord.PermissionFlagsBits.ModerateMembers,
        type: 'USER',
    },
    exec: async (interaction) => {
        if (!interaction.targetMember) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ このユーザーはサーバーにいません!')
                .setColor('Red');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.targetUser == interaction.client.user) {
			const embed = new discord.EmbedBuilder()
				.setDescription(`❌ **${interaction.client.user.username}**自身をタイムアウトさせることはできません！`)
				.setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (interaction.targetUser == interaction.user) {
			const embed = new discord.EmbedBuilder()
				.setDescription('❌ 自分自身をタイムアウトしようとしています...')
				.setColor('White');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

        interaction.targetMember.timeout(date.toMS('28d'), `緊急タイムアウト by ${interaction.user.tag}`)
            .then(() => {
                const embed = new discord.EmbedBuilder()
                    .setDescription(`⛔ ${interaction.targetUser}を**緊急タイムアウト**しました (\`28\`日)`)
                    .setColor('Red');
                interaction.reply({ embeds: [embed], ephemeral: true });
            })
            .catch(() => {
				const embed = new discord.EmbedBuilder()
					.setDescription([
                        `❌ <@${interaction.targetMember.id}>(\`${interaction.targetMember.id}\`)のタイムアウトに失敗しました。`,
                        'BOTより上の権限を持っているか、サーバーの管理者です。',
                    ].join('\n'))
					.setColor('Red');
				interaction.reply({ embeds: [embed], ephemeral:true });
			});
    },
};
module.exports = [ ping_command ];