const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
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
    data: { customid: 'modal-setting-leaveCh', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const leave = config.get('leave');

        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        try {
            /** 退室ログに設定したチャンネル */
            const channel = interaction.guild.channels.cache.find(v => v.name === interaction.fields.getTextInputValue('firstTextInput'));
            const successembed = new discord.MessageEmbed()
                .setDescription('✅ 退室ログがここに送信されます!')
                .setColor('GREEN');
            channel.send({ embeds: [successembed] })
                .then(() => {
                    Configs.update({ leaveCh: channel.id }, { where: { serverId: interaction.guildId } });
                    if (leave) {embed.spliceFields(1, 1, { name: '退室ログ', value: `${discord.Formatters.formatEmoji('758380151544217670')}有効 (${discord.Formatters.channelMention(channel.id)})`, inline:true });}
                    button.components[1].setDisabled(false);
                    interaction.update({ embeds: [embed], components: [select, button], ephemeral: true });
                })
                .catch(() => {
                    const MissingPermission = new discord.MessageEmbed()
                        .setTitle('エラー!')
                        .setDescription([
                            '⚠️ **BOTの権限が不足しています!**',
                            '必要な権限: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
                        ].join('\n'))
                        .setColor('RED');
                    interaction.update({ embeds: [embed, MissingPermission], components: [select, button], ephemeral: true });
                });
        }
        catch {
            const notFound = new discord.MessageEmbed()
                .setTitle('エラー!')
                .setDescription(`⚠️ ${discord.Formatters.inlineCode(interaction.fields.getTextInputValue('firstTextInput'))}という名前のチャンネルは存在しません!`)
                .setColor('RED');
            interaction.update({ embeds: [embed, notFound], ephemeral: true });
        }
    },
};