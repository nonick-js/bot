const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ModalSubmitInteraction} interaction
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
    data: { customid: 'userReport', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const reportRoleMention = config.get('reportRoleMention');
        const reportCh = config.get('reportCh');
        const reportRole = config.get('reportRole');

        const embed = interaction.message.embeds[0];
        const user = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''));
        /** @type {discord.User} */
        const reportUser = interaction.user;
        const reportReason = interaction.fields.getTextInputValue('firstTextInput');

        const reportEmbed = new discord.MessageEmbed()
            .setTitle(language('REPORT_USER_SLAVE_EMBED_TITLE'))
            .setDescription(`\`\`\`${reportReason}\`\`\``)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: `${language('REPORT_USER_EMBED_FIELD_1')}`, value: `${user}`, inline:true },
            )
            .setFooter({ text: `${language('REPORT_USER_SLAVE_EMBED_FOOTER', reportUser.tag)}`, iconURL: reportUser.displayAvatarURL() })
            .setColor('RED');

        interaction.member.guild.channels.fetch(reportCh)
            .then(channel => {
                const content = reportRoleMention ? `<@&${reportRole}>` : ' ';
                channel.send({ content: content, embeds: [reportEmbed] })
                    .then(() => interaction.update({ content: `${language('REPORT_SUCCESS')}`, embeds: [], components: [] }))
                    .catch(() => {
                        Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                        interaction.update({ content: `${language('REPORT_ERROR')}`, embeds: [], components: [] });
                    });
            })
            .catch(() => {
                Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                interaction.update({ content: `${language('REPORT_ERROR')}`, embeds: [], components: [] });
            });
    },
};