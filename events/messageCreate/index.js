// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
/**
 * @callback messageCreateCallback
 * @param {discord.Message} message
 */

module.exports = {
    /** @type {messageCreateCallback} */
    async execute(message) {
        if (message.author.bot || message.author == message.client.user || !message.guild) return;

        require('./linkOpen').execute(message);
    },
};