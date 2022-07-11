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
    data: { customid: 'messageReport', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const { reportRole, reportRoleMention, reportCh } = config.get();

        const embed = interaction.message.embeds[0];
        const user = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''));
        const channel = embed.fields[1].value;
        /** @type {discord.User} */
        const reportUser = interaction.user;
        const reportReason = interaction.fields.getTextInputValue('firstTextInput');

        const reportEmbed = new discord.MessageEmbed()
            .setTitle(language('REPORT_MESSAGE_SLAVE_EMBED_TITLE'))
            .setDescription(`\`\`\`${reportReason}\`\`\``)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: `${language('REPORT_MESSAGE_EMBED_FIELD_1')}`, value: `${user}`, inline:true },
                { name: `${language('REPORT_MESSAGE_EMBED_FIELD_2')}`, value: `${channel}`, inline:true },
            )
            .setColor('RED')
            .setFooter({ text: `${language('REPORT_MESSAGE_SLAVE_EMBED_FOOTER', reportUser.tag)}`, iconURL: reportUser.displayAvatarURL() });
        if (embed.fields[2].value) reportEmbed.addFields({ name: `${language('REPORT_MESSAGE_EMBED_FIELD_3')}`, value: `${embed.fields[2].value}` });
        if (embed.image) reportEmbed.setImage(embed.image.url);

        interaction.member.guild.channels.fetch(reportCh)
            .then(reportchannel => {
                const content = reportRoleMention ? `<@&${reportRole}>` : ' ';
                reportchannel.send({ content: content, embeds: [reportEmbed] })
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