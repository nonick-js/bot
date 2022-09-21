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
        const Model = await require('../../models/basic')(message.sequelize).findOne({ where: { serverId: message.guild.id } });
        if (!Model?.get('messageExpansion')) return;

        expansion.urlExpansion(message);
    },
};