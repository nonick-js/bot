// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildMemberUpdateCallback
 * @param {discord.GuildMember} oldMember
 * @param {discord.GuildMember} newMember
 */

module.exports = {
    /** @type {guildMemberUpdateCallback} */
    async execute(oldMember, newMember) {
        if (oldMember.user == oldMember.client.user) return;

        require('./timeoutLog').execute(oldMember, newMember);
        require('./unTimeoutLog').execute(oldMember, newMember);
    },
};