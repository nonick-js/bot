const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_player = require('discord-player');

/**
 * @callback connectionErrorCallback
 * @param {discord.Client} client
 * @param {discord_player.Queue} queue
 * @param {Error} error
 */

module.exports = {
    async execute(client, queue, error, language) {
        const embed = new discord.MessageEmbed()
            .setTitle(language('CONNECTIONERROR_EMBED_TITLE'))
            .setDescription(discord.Formatters.codeBlock(error))
            .setColor('RED');
        // eslint-disable-next-line no-empty-function
        queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
    },
};