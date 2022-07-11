const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ModalSubmitInteraction} interaction
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
    data: { customid: 'setvolume', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language, player) => {
        const queue = player.getQueue(interaction.guildId);
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

        const amount = Number(interaction.fields.getTextInputValue('textinput'));
        const content = interaction.message.content;
        const button = interaction.message.components[0];
        if (amount < 1 || amount > 200) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_VOLUME_ERROR'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        queue.setVolume(amount);
        interaction.update({ content: content, components: [button] });
        // eslint-disable-next-line no-empty-function
        await queue.metadata.channel.send(language('MUSIC_VOLUME_SUCCESS', amount)).catch(() => {});
    },
};