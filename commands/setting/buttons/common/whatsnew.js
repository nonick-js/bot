const fs = require('fs');
const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-whatsnew', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
        const { version, whatsnew } = JSON.parse(fs.readFileSync('./version.json', 'utf-8'));
        const embed = new discord.MessageEmbed()
            .setTitle('What\'s New')
            .setDescription(discord.Formatters.inlineCode(`現在のバージョン: v${version}`) + `\n${whatsnew}`)
            .setColor('BLUE');
        interaction.reply({ embeds: [embed] });
    },
};