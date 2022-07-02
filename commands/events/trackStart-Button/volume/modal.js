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
    exec: async (interaction, client, Configs, player) => {
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

        const amount = Number(interaction.fields.getTextInputValue('textinput'));
        const content = interaction.message.content;
        const button = interaction.message.components[0];
        if (amount < 1 || amount > 200) {
            const embed = new discord.MessageEmbed()
                .setDescription(`❌ 音量は${discord.Formatters.inlineCode('1')}から${discord.Formatters.inlineCode('200')}までの間で指定してください!`)
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        queue.setVolume(amount);
        interaction.update({ content: content, components: [button] });
        // eslint-disable-next-line no-empty-function
        await queue.metadata.channel.send(`🔊 音量を${discord.Formatters.inlineCode(amount)}に変更しました`).catch(() => {});
    },
};