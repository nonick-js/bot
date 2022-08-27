// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.Client} client
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(client, member, Configs) {
        if (member == member.guild.me) return;
        require('./welcomeMessage').execute(client, member, Configs);
    },
};