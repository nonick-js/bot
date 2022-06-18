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
    data: { customid: 'music-loop', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs, player) => {
        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);
        const button = interaction.message.components[0];
        const button1 = interaction.message.components[1];
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

        queue.setRepeatMode(queue.repeatMode == 1 ? 0 : 1);
        interaction.update({ components: [button, button1], ephemeral: true });
        // eslint-disable-next-line no-empty-function
        await queue.metadata.channel.send(`🔂 1曲ループ再生を**${queue.repeatMode == 0 ? 'オフ' : 'オン' }**にしました`).catch(() => {});
    },
};