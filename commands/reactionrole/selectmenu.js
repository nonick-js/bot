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

        if (roles instanceof discord.GuildMemberRoleManager) {
            await roles.remove(interaction.component.options.map(opt => opt.value).filter(opt => !interaction.values.includes(opt))).catch(() => error = true);
            await roles.add(interaction.values).catch(() => error = true);

            try {
                if (error && interaction.member.permissions.has(discord.PermissionFlagsBits.ManageRoles)) { throw [
                    '一部ロールが付与/解除できませんでした。以下を確認してください。**\n',
                    `・${interaction.client.user.username}に\`ロール管理\`権限が付与されているか。`,
                    `・パネルにある役職よりも上に**${interaction.client.user.username}**が持つ役職があるか。`,
                    '・BOT専用ロールなど、手動で付与することができないロールでないか。',
                    '・ロールが存在しているか。',
                ].join('\n'); }
                if (error) throw '一部ロールが付与/解除できませんでした。サーバーの管理者にお問い合わせください。';
            } catch (err) {
                const embed = new discord.EmbedBuilder()
                    .setDescription(`${discord.formatEmoji('1014606484849565797')} ${err}`)
                    .setColor('Red');
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const embed = new discord.EmbedBuilder()
                .setDescription('✅ ロールを更新しました!')
                .setColor('Green');
            return interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            return interaction.followUp({ content: '❌ このチャンネルでは使用できません', ephemeral: true });
        }
    },
};
module.exports = [ ping_command ];