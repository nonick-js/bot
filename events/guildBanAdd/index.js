// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

module.exports = {
  /** @param {discord.GuildBan} ban */
  async execute(ban) {
    if (ban.user == ban.client.user) return;

    require('./banLog').execute(ban);
  },
};