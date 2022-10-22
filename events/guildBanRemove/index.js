// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

/**
 * @callback guildBanRemoveCallback
 * @param {discord.GuildBan} ban
 */

module.exports = {
  /** @type {guildBanRemoveCallback} */
  async execute(ban) {
    if (blackList.guilds.includes(ban.guild.id) || blackList.users.includes(ban.guild.ownerId)) return;
    if (ban.user == ban.client.user) return;

    require('./banRemoveLog').execute(ban);
  },
};