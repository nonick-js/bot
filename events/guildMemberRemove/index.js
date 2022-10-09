// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

module.exports = {
	/** @param {discord.GuildMember} member */
	async execute(member) {
		if (member.user == member.client.user) return;

		require('./leaveMessage').execute(member);
		require('./kickLog').execute(member);
	},
};