// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

/**
 * @callback messageCreateCallback
 * @param {discord.Message} message
 */

module.exports = {
	/** @type {messageCreateCallback} */
	async execute(message) {
		if (blackList.guilds.includes(message.guild.id) || blackList.users.includes(message.guild.ownerId)) return;
		if (message.author.bot || message.author == message.client.user || !message.guild) return;

		require('./messageExpansion').execute(message);
	},
};