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
    data: { customid: 'setting-Channel', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        /** @type {Array} 設定する項目 splice位置 */
        const settingInfo = interaction.components[0].components[0].customId.split(',');
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        const name = embed.fields[parseInt(settingInfo[1], 10)].name;
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });

        try {
            const channel = interaction.guild.channels.cache.find(v => v.name === textInput);
            const successembed = new discord.MessageEmbed()
                .setDescription(`✅ **${name}**がここに送信されます!`)
                .setColor('GREEN');
            channel.send({ embeds: [successembed] })
                .then(() => {
                    Configs.update({ [settingInfo[0]]: channel.id }, { where: { serverId: interaction.guildId } });
                    if (config.get(settingInfo[0].slice(0, -2))) {
                        if (config.get(settingInfo[0].slice(0, -2)) == 'report') {
                            embed.spliceFields(0, 1, { name: name, value: `${discord.Formatters.channelMention(channel.id)}`, inline:true });
                        } else {
                            embed.spliceFields(0, 1, { name: name, value: `${discord.Formatters.formatEmoji('758380151544217670')}有効 (${discord.Formatters.channelMention(channel.id)})`, inline:true });
                        }
                    }
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
                .setDescription(`⚠️ ${discord.Formatters.inlineCode(textInput)}という名前のチャンネルは存在しません!`)
                .setColor('RED');
            interaction.update({ embeds: [embed, notFound], ephemeral: true });
        }
    },
};