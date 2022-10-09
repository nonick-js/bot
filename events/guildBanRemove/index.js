// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback guildBanRemoveCallback
 * @param {discord.GuildBan} ban
 */

module.exports = {
  /** @type {guildBanRemoveCallback} */
  async execute(ban) {
    if (ban.user == ban.client.user) return;

    require('./banRemoveLog').execute(ban);
  },
};