const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {customid: "setting-control-laungage", type: "BUTTON"},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
        const embed = new discord.MessageEmbed()
            .setDescription("この機能は現在開発中です! 実装をお待ち下さい。")
            .setColor("BLUE");
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}