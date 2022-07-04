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
    data: { customid: 'banSetting', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { banLog, banLogCh, banDm } = config.get();

        /** @type {discord.MessageEmbed} */
        const embed = interaction.message.embeds[0];
        if (!embed) return;
        /** @type {discord.MessageActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.MessageActionRow} */
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-back')
                .setEmoji('971389898076598322')
                .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-ban-1') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-banLog')
                    .setLabel(banLog ? '無効化' : '有効化')
                    .setStyle(banLog ? 'DANGER' : 'SUCCESS')
                    .setDisabled(banLogCh ? false : true),
                new discord.MessageButton()
                    .setCustomId('setting-banLogCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
            );
            select.components[0].options[0].default = true;
            select.components[0].options[1].default = false;
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }

        if (interaction.values == 'setting-ban-2') {
            button.addComponents(
                new discord.MessageButton()
                    .setCustomId('setting-banDm')
                    .setLabel(banDm ? '無効化' : '有効化')
                    .setStyle(banDm ? 'DANGER' : 'SUCCESS'),
            );
            select.components[0].options[0].default = false;
            select.components[0].options[1].default = true;
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};