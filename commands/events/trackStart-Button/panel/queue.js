const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_player = require('discord-player');

/**
* @callback InteractionCallback
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'music-queue', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs, player) => {
        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);
        if (!queue) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ 現在キューはありません!')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!interaction.member.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ ボイスチャンネルに参加してください!')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ 現在再生中のボイスチャンネルに参加してください!')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const track = queue.tracks;
        let queueString = '';
        const nowPlaying = `💿 **${queue.current.title}**\n🔗 ${queue.current.url}\n${queue.createProgressBar()}`;
        for (let i = 0; i < track.length; i++) {
            queueString = queueString + `**${i + 1}.** ${track[i].title}\n`;
        }
        if (queueString == null) queueString = 'なし';
        const embed = new discord.MessageEmbed()
            .setThumbnail(queue.current.thumbnail)
            .setColor('WHITE')
            .addFields(
                { name: '再生中', value: nowPlaying },
            )
            .setFooter({ text: queue.repeatMode == 0 ? '▶️ 通常再生' : queue.repeatMode == 1 ? '🔂 1曲ループ再生' : '🔁 キューループ再生' });
        if (queueString !== '') embed.addFields({ name: 'キュー', value: queueString });
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};