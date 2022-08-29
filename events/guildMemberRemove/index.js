// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(member) {
        if (member.user == member.client.user) return;

        require('./welcomeMessage').execute(member);
    },
};