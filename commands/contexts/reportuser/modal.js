const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ModalSubmitInteraction} interaction
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
        const { reportRole, reportRoleMention, reportCh } = config.get();

        const userId = interaction.components[0].components[0].customId;
        const reportReason = interaction.components[0].components[0].value;
        /** @type {discord.User} */
        // eslint-disable-next-line no-empty-function
        const user = await client.users.fetch(userId).catch(() => {});

        if (!user) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('REPORT_USER_UNDEFINED'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.MessageEmbed()
            .setTitle(language('REPORT_USER_SLAVE_EMBED_TITLE'))
            .setDescription(`\`\`\`${reportReason}\`\`\``)
            .addFields(
                { name: `${language('REPORT_USER_EMBED_FIELD_1')}`, value: `${user}`, inline:true },
            )
            .setColor('RED')
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: `${language('REPORT_USER_SLAVE_EMBED_FOOTER', interaction.user.tag)}`, iconURL: interaction.user.displayAvatarURL() });

        // eslint-disable-next-line no-empty-function
        const Ch = await interaction.guild.channels.fetch(reportCh).catch(() => {});

        if (!Ch) {
            Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
            return interaction.reply({ content: `${language('REPORT_ERROR')}`, ephemeral: true });
        }

        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';

        Ch.send({ content: content, embeds: [embed] })
            .then(() => {
                interaction.reply({ content: `${language('REPORT_SUCCESS')}`, ephemeral: true });
            })
            .catch(() => {
                Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                interaction.reply({ content: `${language('REPORT_ERROR')}`, ephemeral: true });
            });
    },
};