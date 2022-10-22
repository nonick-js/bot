// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { blackList } = require('../../config.json');

module.exports = {
  /** @param {discord.Message} message */
  async execute(message) {
    if (blackList.guilds.includes(message.guildId)) return;

    require('./removeRolePanelList').execute(message);
  },
};