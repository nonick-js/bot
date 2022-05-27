const fs = require('fs');
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
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {customid: 'welcomeSetting', type: 'SELECT_MENU'},
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({where: {serverId: interaction.guild.id}});
        const welcome = config.get('welcome');
        const welcomeCh = config.get('welcomeCh');
        const embed = interaction.message.embeds[0];

        // if (interaction.values == 'setting-report-1') {
        //     if (!embed) return;
        //     const button = new discord.MessageActionRow().addComponents([
        //         new discord.MessageButton()
        //             .setCustomId('setting-back')
        //             .setEmoji('971389898076598322')
        //             .setStyle('PRIMARY'),
        //         new discord.MessageButton()
        //             .setCustomId('setting-welcome')
        //             .setLabel('ON')
        //             .setStyle('SUCCESS'),
        //         new discord.MessageButton()
        //             .setCustomId('setting-welcomeCh')
        //             .setLabel('送信先')
        //             .setEmoji('966588719635267624')
        //             .setStyle('SECONDARY'),
        //         new discord.MessageButton()
        //             .setCustomId('setting-welcomeMessage')
        //             .setLabel('メッセージ')
        //             .setEmoji('966596708458983484')
        //             .setStyle('SECONDARY'),
        //     ]);
        //     const select = new discord.MessageActionRow().addComponents([
        //         new discord.MessageSelectMenu()
        //         .setCustomId('welcomeSetting')
        //         .setPlaceholder('ここから選択')
        //         .addOptions([
        //             {label: '全般設定', value: 'setting-report-1', emoji: '🌐', default: true},
        //         ]),
        //     ]);
        //     if (!welcome) {
        //         button.components[1].setStyle('DANGER');
        //         button.components[1].setLabel('OFF');
        //     }
        //     if (welcomeCh == null) button.components[1].setDisabled(true);
        //     interaction.update({embeds: [embed], components: [select, button], ephemeral:true});
        // }  
    }
}