const fs = require('fs');
const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {customid: 'setting-reportRoleMention', type: 'BUTTON'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({where: {serverId: interaction.guild.id}});
        const reportRoleMention = config.get('reportRoleMention');
        const reportRole = config.get('reportRoleMention');
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        if (reportRoleMention) {
            Configs.update({reportRoleMention: false}, {where: {serverId: interaction.guild.id}});
            embed.spliceFields(1, 1, {name: 'ロールメンション', value: discord.Formatters.formatEmoji('758380151238033419')+' 無効化中', inline:true});
            button.components[1].setLabel('OFF');
            button.components[1].setStyle('DANGER');
        } else {
            Configs.update({reportRoleMention: true}, {where: {serverId: interaction.guild.id}});
            embed.spliceFields(1, 1, {name: 'ロールメンション', value: discord.Formatters.formatEmoji('758380151544217670')+' 有効化中' + '('+ discord.Formatters.roleMention(reportRole) +')', inline:true});
            button.components[1].setLabel('ON');
            button.components[1].setStyle('SUCCESS');
        }
        interaction.update({embeds: [embed], components: [select, button], ephemeral:true});
    }
}