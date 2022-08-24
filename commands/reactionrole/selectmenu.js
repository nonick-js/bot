const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.SelectMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'reactionRole', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
        if (interaction.message.flags.has('EPHEMERAL')) return interaction.update({});
        interaction.deferReply({ ephemeral: true });

        const roles = interaction.member?.roles;
        // eslint-disable-next-line no-undef
        if (roles instanceof GuildMemberRoleManager) {
            await roles.remove(interaction.component.options.map(opt => opt.value).filter(opt => !interaction.values.includes(opt)));
            await roles.add(interaction.values)
                .then(() => {
                    const embed = new discord.MessageEmbed()
                        .setDescription('✅ ロールを更新しました!')
                        .setColor('RED');
                    return interaction.followUp({ embeds: [embed], ephemeral: true });
                }).catch(() => {
                    const embed = new discord.MessageEmbed().setColor('RED');
                    if (interaction.member.permissions.has('MANAGE_ROLES')) {
                        embed.setDescription([
                            `${discord.Formatters.formatEmoji('968351750434193408')} 一部ロールが付与できませんでした。以下を確認してください。`,
                            `・${client.user.username}に\`ロール管理\`権限が付与されているか。`,
                            `・パネルにある役職よりも上に${client.user.username}が持つ役職があるか。`,
                            '・ロールが存在しているか。',
                        ]);
                    } else {
                        embed.setDescription(`${discord.Formatters.formatEmoji('968351750434193408')} 一部ロールが付与できませんでした。サーバーの管理者にお問い合わせください。`);
                    }
                    return interaction.followUp({ embeds: [embed], ephemeral: true });
                });
        } else {
            return interaction.followUp({ content: '❌ このチャンネルでは使用できません', ephemeral: true });
        }
    },
};