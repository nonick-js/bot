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
    data: { customid: 'welcomeSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { welcome, welcomeCh, leave, leaveCh } = config.get();

        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-welcome-1') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-welcome')
                    .setLabel(welcome ? language('SETTING_BUTTON_DISABLE') : language('SETTING_BUTTON_ENABLE'))
                    .setStyle(welcome ? 'DANGER' : 'SUCCESS')
                    .setDisabled(welcomeCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel(language('SETTING_BUTTON_CH'))
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel(language('SETTING_BUTTON_MESSAGE'))
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            );
        }

        if (interaction.values == 'setting-welcome-2') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-leave')
                    .setLabel(leave ? language('SETTING_BUTTON_DISABLE') : language('SETTING_BUTTON_ENABLE'))
                    .setStyle(leave ? 'DANGER' : 'SUCCESS')
                    .setDisabled(leaveCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-leaveCh')
                    .setLabel(language('SETTING_BUTTON_CH'))
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            );
        }

        for (let i = 0; i < select.components[0].options.length; i++) {
            select.components[0].options[i].default = false;
        }
        const index = select.components[0].options.findIndex(v => v.value == interaction.values[0]);
        select.components[0].options[index].default = true;
        interaction.update({ components: [select, button], ephemeral:true });
    },
};