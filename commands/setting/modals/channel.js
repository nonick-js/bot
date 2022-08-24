const discord = require('discord.js');
const fieldIndex = {
    welcomeCh: [0, 'welcome', 1],
    reportCh: [0, 'report', 1],
    leaveCh: [1, 'leave', 1],
};

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ModalSubmitInteraction} interaction
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
    exec: async (client, interaction, Configs) => {
        const setting = interaction.components[0].components[0].customId;
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = interaction.message.components[1];

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });

        const ch = interaction.guild.channels.cache.find(v => v.name == textInput);
        if (!ch) {
            const error = new discord.MessageEmbed()
                .setDescription(`⚠️ \`${textInput}\`という名前のチャンネルは存在しません!`)
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        const successEmbed = new discord.MessageEmbed()
            .setDescription(`✅ **${embed.fields[fieldIndex[setting][0]].name}**がここに送信されます!`)
            .setColor('GREEN');

        ch.send({ embeds: [successEmbed] })
            .then(() => {
                Configs.update({ [setting]: ch.id }, { where: { serverId: interaction.guildId } });
                if (setting == 'reportCh') {
                    embed.fields[fieldIndex[setting][0]].value = `<#${ch.id}>`;
                } else {
                    if (config.get(fieldIndex[setting][1])) embed.fields[fieldIndex[setting][0]].value = `${discord.Formatters.formatEmoji('758380151544217670')} 有効 (<#${ch.id}>)`;
                    button.components[fieldIndex[setting][2]].setDisabled(false);
                }
                interaction.update({ embeds: [embed], components: [select, button] });
            })
            .catch(() => {
                const MissingPermission = new discord.MessageEmbed()
                    .setDescription('⚠️ **BOTの権限が不足しています!**\n必要な権限: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`')
                    .setColor('RED');
                interaction.update({ embeds: [embed, MissingPermission] });
            });
    },
};