// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
/**
 * @callback messageCreateCallback
 * @param {discord.Client} client
 * @param {discord.Message} message
 */

module.exports = {
    /** @type {messageCreateCallback} */
    async execute(client, message, Configs) {
        if (message.author.bot) return;
        require('./linkOpen').execute(client, message, Configs);
    },
};