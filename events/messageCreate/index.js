const utils = require('../../modules/utils');

module.exports = {
	/** @param {import('discord.js').Message} */
	async execute(message) {
		if (utils.isBlocked(message.guild)) return;
		if (message.author.bot || message.author == message.client.user || !message.guild) return;

		require('./messageExpansion').execute;
	},
};