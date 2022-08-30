// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildBanAddCallback
 * @param {discord.GuildBan} ban
 */

module.exports = {
    /** @type {guildBanAddCallback} */
    async execute(ban) {
        if (ban.user == ban.client.user) return;

        require('./log').execute(ban);
    },
};