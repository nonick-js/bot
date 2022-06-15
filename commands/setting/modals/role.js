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
    data: { customid: 'setting-Role', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        /** @type {Array} 設定する項目 splice位置 */
        const settingInfo = interaction.components[0].components[0].customId.split(',');
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        // 埋め込みのFieldを編集する場所
        const name = embed.fields[parseInt(settingInfo[1], 10)].name;
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const configMention = config.get(settingInfo[0] + 'Mention');

        try {
            const roleId = interaction.guild.roles.cache.find((role) => role.name === textInput).id;
            Configs.update({ [settingInfo[0]]: roleId }, { where: { serverId: interaction.guildId } });
            button.components[1].setDisabled(false);
            if (configMention) embed.spliceFields(parseInt(settingInfo[1], 10), 1, { name: name, value: discord.Formatters.formatEmoji('758380151544217670') + ' 有効化中' + '(' + discord.Formatters.roleMention(roleId) + ')', inline:true });
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
        catch {
            const roleNotFound = new discord.MessageEmbed()
                .setTitle('エラー!')
                .setDescription(`⚠️ ${discord.Formatters.inlineCode(textInput)}という名前のロールは存在しません!`)
                .setColor('RED');
            interaction.update({ embeds: [embed, roleNotFound], components: [select, button], ephemeral:true });
        }
    },
};