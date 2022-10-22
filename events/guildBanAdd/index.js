// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

module.exports = {
  /** @param {discord.GuildBan} ban */
  async execute(ban) {
    if (blackList.guilds.includes(ban.guild.id) || blackList.users.includes(ban.guild.ownerId)) return;
    if (ban.user == ban.client.user) return;

    require('./banLog').execute(ban);
  },
};