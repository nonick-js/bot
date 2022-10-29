const utils = require('../../modules/utils');

module.exports = {
	/**
	 * @param {import('discord.js').GuildMember} oldMember
	 * @param {import('discord.js').GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
		if (utils.isBlocked(oldMember.guild)) return;
		if (oldMember.user == oldMember.client.user || !newMember) return;

		require('./timeoutLog').execute;
		require('./unTimeoutLog').execute;
	},
};