const fs = require('fs');
const { blackList, beta } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

/** @param {import('discord.js').Guild} guild*/
async function isBlocked(guild) {
  if (blackList.guilds.includes(guild.guild?.id) && blackList.users.includes(guild.ownerId)) return true;
  if (beta?.enable && guild.guild?.id) {
    const betaGuild = await guild.client.guilds.fetch(beta.guildId);
    const betaRole = await betaGuild.roles.fetch(beta.roleId);
    if (!betaRole.members.find(v => v.id == guild.ownerId)) return true;
  }
  return false;
}

module.exports = { isBlocked };