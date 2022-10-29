const utils = require('../../modules/utils');

module.exports = {
  /** @param {import('discord.js').GuildMember member} */
  async execute(member) {
    if (utils.isBlocked(member.guild)) return;
    if (member.user == member.client.user) return;

    require('./welcomeMessage').execute;
  },
};