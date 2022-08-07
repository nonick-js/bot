const discord = require('discord.js');
const fieldIndex = {
    reportRole: [1, 'reportRoleMention', 1],
};

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
    data: { customid: 'setting-Role', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const setting = interaction.components[0].components[0].customId;
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });

        const role = interaction.guild.roles.cache.find(v => v.name == textInput);
        if (!role) {
            const roleNotFound = new discord.MessageEmbed()
                .setDescription(language('Setting.Error.RoleNotfound', textInput))
                .setColor('RED');
            return interaction.update({ embeds: [embed, roleNotFound] });
        }

        console.log(setting);
        Configs.update({ [setting]: role.id }, { where: { serverId: interaction.guildId } });
        if (config.get(fieldIndex[setting][1])) embed.fields[fieldIndex[setting][0]].value = language('Setting.Common.Embed.Role_enable', role.id);
        button.components[fieldIndex[setting][2]].setDisabled(false);
        interaction.update({ embeds: [embed], components: [select, button] });
    },
};