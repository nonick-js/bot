// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const expansion = require('../../modules/expansion');

/**
 * @callback messageCreateCallback
 * @param {import('discord.js').Message}
 */

module.exports = {
    /** @type {messageCreateCallback} */
    async execute(message) {
        const config = await message.db_config.findOne({ where: { serverId: message.guild.id } });
        if (!config.get('linkOpen')) return;

        expansion.urlExpansion(message);
    },
};