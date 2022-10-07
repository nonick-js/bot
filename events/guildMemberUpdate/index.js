// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

module.exports = {
	/**
	 * @param {discord.GuildMember} oldMember
	 * @param {discord.GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
		if (oldMember.user == oldMember.client.user || !newMember) return;

		require('./timeoutLog').execute(oldMember, newMember);
		require('./unTimeoutLog').execute(oldMember, newMember);
	},
};