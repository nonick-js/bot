// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'reactionRole',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        if (interaction.message.flags.has(discord.MessageFlags.Ephemeral)) return interaction.update({});
        await interaction.deferReply({ ephemeral: true });

        const roles = interaction.member?.roles;
        let error = false;
        // eslint-disable-next-line no-undef
        if (roles instanceof discord.GuildMemberRoleManager) {
            await roles.remove(interaction.component.options.map(opt => opt.value).filter(opt => !interaction.values.includes(opt))).catch(() => error = true);
            await roles.add(interaction.values).catch(() => error = true);

            if (!error) {
                const embed = new discord.EmbedBuilder()
                    .setDescription('✅ ロールを更新しました!')
                    .setColor('Green');
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new discord.EmbedBuilder()
                    .setDescription(`${discord.formatEmoji('968351750434193408')} 一部ロールが付与/解除できませんでした。サーバーの管理者にお問い合わせください。`)
                    .setColor('Red');

                if (interaction.member.permissions.has(discord.PermissionFlagsBits.ManageRoles)) {
                    embed.setDescription([
                        `${discord.formatEmoji('968351750434193408')}** 一部ロールが付与/解除できませんでした。以下を確認してください。**`,
                        `・${interaction.client.user.username}に\`ロール管理\`権限が付与されているか。`,
                        `・パネルにある役職よりも上に**${interaction.client.user.username}**が持つ役職があるか。`,
                        '・BOT専用ロールなど、手動で付与することができないロールでないか。',
                        '・ロールが存在しているか。',
                    ].join('\n'));
                }
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }
        } else {
            return interaction.followUp({ content: '❌ このチャンネルでは使用できません', ephemeral: true });
        }
    },
};
module.exports = [ ping_command ];