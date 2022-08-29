// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback MemberAddCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(member) {
        if (member.user == member.client.user) return;

        require('./welcomeMessage').execute(member);
    },
};