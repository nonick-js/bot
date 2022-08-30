// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildBanRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {guildBanRemoveCallback} */
    async execute(member) {
        if (member.user == member.client.user) return;

        require('./log').execute(member);
    },
};