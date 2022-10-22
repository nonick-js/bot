// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

/**
 * @callback MemberAddCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
  /** @type {MemberAddCallback} */
  async execute(member) {
    if (blackList.guilds.includes(member.guild.id) || blackList.users.includes(member.guild.ownerId)) return;
    if (member.user == member.client.user) return;

    require('./welcomeMessage').execute(member);
  },
};