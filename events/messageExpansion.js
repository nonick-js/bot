const ConfigSchema = require('../schemas/configSchema');
const { urlExpansion } = require('../modules/expansion');
const { Events } = require('discord.js');
const { isBlocked } = require('../utils/functions');

const messageExpansion = {
  name: Events.MessageCreate,
  once: false,
  /** @param {import('discord.js').Message} message */
	async execute(message) {
    if (!isBlocked(message.guild)) return;

    const GuildConfig = await ConfigSchema.findOne({ serverId: message.guildId });
    if (!GuildConfig?.messageExpansion) return;

    urlExpansion(message);
  },
};

module.exports = [ messageExpansion ];