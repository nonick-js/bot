const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_player = require('discord-player');

/**
 * @callback trackStartCallback
 * @param {discord.Client} client
 * @param {discord_player.Queue} queue
 * @param {discord_player.Track} track
 */

module.exports = {
    /** @type {trackStartCallback} */
    async execute(client, queue, track, language) {
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('music-prev')
                .setEmoji('⏮️')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('music-pause')
                .setEmoji('⏯️')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('music-skip')
                .setEmoji('⏭️')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('music-volume')
                .setEmoji('🔊')
                .setStyle('SECONDARY'),
            new discord.MessageButton()
                .setCustomId('music-panel')
                .setEmoji('966596708458983484')
                .setStyle('SUCCESS'),
        );
        // eslint-disable-next-line no-empty-function
        await queue.metadata.channel.send({ content: `▶ ${language('TRACKSTART_PLAYING')} 🔗${track.url}`, components: [button] }).catch(() => {});
    },
};