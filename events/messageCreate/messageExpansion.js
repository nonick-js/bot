// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');
const expansion = require('../../modules/expansion');

module.exports = {
	/** @param {discord.Message} message */
	async execute(message) {
		const Config = await Configs.findOne({ serverId: message.guildId });
		if (!Config?.messageExpansion) return;

		expansion.urlExpansion(message);
	},
};