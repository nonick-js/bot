const utils = require('../../modules/utils');

module.exports = {
 /** @param {import('discord.js').GuildBan} ban **/
  async execute(ban) {
    if (utils.isBlocked(ban.guild)) return;
    if (ban.user.id == ban.client.user.id) return;

    require('./banRemoveLog').execute;
  },
};