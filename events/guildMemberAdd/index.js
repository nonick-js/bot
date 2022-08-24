// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback MemberAddCallback
 * @param {discord.Client} client
 * @param {discord.GuildMember} member
 * @returns {void}
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(client, member, Configs) {

        const welcomeMessage = require('./welcomeMessage');

        welcomeMessage.execute(client, member, Configs);
    },
};