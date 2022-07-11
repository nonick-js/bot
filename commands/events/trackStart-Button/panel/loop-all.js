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
    data: { customid: 'music-loop-all', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language, player) => {

        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);
        const button = interaction.message.components[0];
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { dj, djRole } = config.get();

        if (dj && !interaction.member.roles.cache.has(djRole) && !interaction.member.permissions.has('ADMINISTRATOR')) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_DJROLE', djRole))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!queue) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_NULLQUEUE'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!interaction.member.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_VC_NOTJOIN'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_PLAYINGVC_NOTJOIN'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.setRepeatMode(queue.repeatMode == 2 ? 0 : 2);
        interaction.update({ components: [button], ephemeral: true });
        // eslint-disable-next-line no-empty-function
        await queue.metadata.channel.send(language('MUSIC_LOOP_BUTTON_PLAYMODE_3', queue.repeatMode)).catch(() => {});
    },
};