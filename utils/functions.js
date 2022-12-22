const { blackList } = require('../config.json');

/**
 * @param {String} text
 * @returns {Boolean}
 */
const isURL = (text) => {
  return (text.startsWith('http://') || text.startsWith('https://'));
};

/** @param {import('discord.js').Guild} guild */
const isBlocked = (guild) => {
  if (
    blackList.guilds.includes(guild.id) ||
    blackList.users.includes(guild.ownerId)
  ) return true;
  return false;
};

module.exports = { isURL, isBlocked };