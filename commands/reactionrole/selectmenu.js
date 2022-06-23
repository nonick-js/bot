const discord = require('discord.js');

/**
* @callback InteractionCallback
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
    exec: async (interaction) => {
        if (interaction.message.flags.has('EPHEMERAL')) return interaction.update({});

        await interaction.deferReply({ ephemeral: true });
        let errorCount = 0;
        for (let i = 0; i < interaction.component.options.length; i++) {
            await interaction.member.roles.remove(interaction.component.options[i].value).catch(() => {
                errorCount = 1;
            });
        }
        for (let i = 0; i < interaction.values.length; i++) {
            await interaction.member.roles.add(interaction.values[i]).catch(() => {
                errorCount = 1;
            });
        }

        if (errorCount == 1) {
            if (interaction.member.permissions.has('MANAGE_ROLES')) {
                const embed = new discord.MessageEmbed()
                    .setDescription([
                        `${discord.Formatters.formatEmoji('968351750434193408')} 一部ロールが付与できませんでした。`,
                        '以下を確認してください。',
                        '・NoNICK.jsに`ロール管理`権限が付与されているか。',
                        '・パネルにある役職よりも上にNoNICK.jsが持つ役職があるか。',
                    ].join('\n'))
                    .setColor('RED');
                interaction.editReply({ embeds: [embed], ephemeral: true });
            } else {
                const embed = new discord.MessageEmbed()
                    .setDescription([
                        `${discord.Formatters.formatEmoji('968351750434193408')} 一部ロールが付与できませんでした。`,
                        'サーバーの管理者にお問い合わせください。',
                    ].join('\n'))
                    .setColor('RED');
                interaction.editReply({ embeds: [embed], ephemeral: true });
            }
        } else {
            const embed = new discord.MessageEmbed()
                .setDescription('✅ ロールを更新しました!')
                .setColor('GREEN');
            interaction.editReply({ embeds: [embed], ephemeral: true });
        }
    },
};