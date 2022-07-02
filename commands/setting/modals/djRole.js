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
    data: { customid: 'setting-djRole', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const dj = config.get('dj');
        const textInput = interaction.fields.getTextInputValue('textinput');

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        const button = interaction.message.components[1];

        try {
            const roleId = interaction.guild.roles.cache.find((role) => role.name === textInput).id;
            Configs.update({ djRole: roleId }, { where: { serverId: interaction.guildId } });
            button.components[1].setDisabled(false);
            if (dj) embed.spliceFields(0, 1, { name: 'DJモード', value: discord.Formatters.formatEmoji('758380151544217670') + ' 有効' + '(' + discord.Formatters.roleMention(roleId) + ')', inline:true });
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