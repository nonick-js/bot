const discord = require('discord.js');
const swicher = require('../../../modules/swicher');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
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
    exec: async (client, interaction, Configs) => {

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
                    .setLabel(swicher.buttonLabelSwicher(welcome))
                    .setStyle(swicher.buttonStyleSwicher(welcome))
                    .setDisabled(swicher.buttonDisableSwicher(welcomeCh)),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel('メッセージ')
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            );
        }

        if (interaction.values == 'setting-welcome-2') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-leave')
                    .setLabel(swicher.buttonLabelSwicher(leave))
                    .setStyle(swicher.buttonStyleSwicher(leave))
                    .setDisabled(swicher.buttonDisableSwicher(leaveCh)),
                new discord.MessageButton()
                    .setCustomId('setting-leaveCh')
                    .setLabel('送信先')
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