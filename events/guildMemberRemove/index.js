// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

module.exports = {
	/** @param {discord.GuildMember} member */
	async execute(member) {
		if (blackList.guilds.includes(member.guild.id) || blackList.users.includes(member.guild.ownerId)) return;
		if (member.user == member.client.user) return;

		require('./leaveMessage').execute(member);
		require('./kickLog').execute(member);
	},
};