// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

module.exports = {
	/**
	 * @param {discord.GuildMember} oldMember
	 * @param {discord.GuildMember} newMember
	 */
	async execute(oldMember, newMember) {
		if (blackList.guilds.includes(oldMember.guild.id) || blackList.users.includes(oldMember.guild.ownerId)) return;
		if (oldMember.user == oldMember.client.user || !newMember) return;

		require('./timeoutLog').execute(oldMember, newMember);
		require('./unTimeoutLog').execute(oldMember, newMember);
	},
};