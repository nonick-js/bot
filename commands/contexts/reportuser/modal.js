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
                .setDescription(language('Report.Common.Embed.Report.User_Undef'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.MessageEmbed()
            .setTitle(language('Report.UserSlave.Embed.Title'))
            .setDescription(`\`\`\`${reportReason}\`\`\``)
            .addFields(
                { name: `${language('Report.UserSlave.Embed.Field.Name_1')}`, value: `${user}`, inline:true },
            )
            .setColor('RED')
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: `${language('Report.UserSlave.Embed.Footer', interaction.user.tag)}`, iconURL: interaction.user.displayAvatarURL() });

        // eslint-disable-next-line no-empty-function
        const Ch = await interaction.guild.channels.fetch(reportCh).catch(() => {});

        if (!Ch) {
            Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
            return interaction.reply({ content: `${language('Report.Common.Embed.Error')}`, ephemeral: true });
        }

        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';

        Ch.send({ content: content, embeds: [embed] })
            .then(() => {
                interaction.reply({ content: `${language('Report.Common.Embed.Success')}`, ephemeral: true });
            })
            .catch(() => {
                Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                interaction.reply({ content: `${language('Report.Common.Embed.Error')}`, ephemeral: true });
            });
    },
};