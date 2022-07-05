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
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'timeoutSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { timeoutLog, timeoutLogCh, timeoutDm } = config.get();

        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-timeout-1') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-timeoutLog')
                    .setLabel(timeoutLog ? '無効化' : '有効化')
                    .setStyle(timeoutLog ? 'DANGER' : 'SUCCESS')
                    .setDisabled(timeoutLogCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-timeoutLogCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            );
            select.components[0].options[0].default = true;
            select.components[0].options[1].default = false;
            interaction.update({ components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-timeout-2') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-timeoutDm')
                    .setLabel(timeoutDm ? '無効化' : '有効化')
                    .setStyle(timeoutDm ? 'DANGER' : 'SUCCESS')
                    .setStyle('SUCCESS'),
            );
            select.components[0].options[0].default = false;
            select.components[0].options[0].default = true;
            interaction.update({ components: [select, button], ephemeral:true });
        }
    },
};