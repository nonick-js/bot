const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client}
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'info', description: 'このBOTについて', descriptionLocalizations: { 'en-US': 'About this BOT' }, type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {
        const embed = new discord.MessageEmbed()
            .setTitle(client.user.username)
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/wiki')
            .setImage('https://media.discordapp.net/attachments/958791423161954445/989779285852168242/3e9aba98d28eaa52.png?width=1178&height=662')
            .setDescription(language('INFO_DESCRIPTION'))
            .setFooter({ text: `${language('INFO_FOOTER_TEXT')}`, iconURL: 'https://media.discordapp.net/attachments/958791423161954445/975266759529623652/-3.png?width=663&height=663' })
            .setColor('WHITE');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setLabel(language('INFO_BUTTON_LABEL'))
                .setStyle('LINK')
                .setURL('https://discord.gg/fVcjCNn733'),
        );
        interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};

// このコマンドの動作の改変を禁止します。
// Copyright © 2022 NoNICK All Rights Reserved.