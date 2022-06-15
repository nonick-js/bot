const discord = require('discord.js');
const { version } = require('../version.json');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'info', description: 'このBOTについて', type: 'CHAT_INPUT' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client) => {
        const embed = new discord.MessageEmbed()
            .setTitle(client.user.username)
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/wiki')
            .setDescription('「分かりやすい」をモットーにした**完全無料の多機能BOT**\nこんな機能が使えるよ!' + discord.Formatters.codeBlock('\n・入退室ログ機能\n・TIMEOUTコマンド\n・通報機能\n・ユーザーの情報閲覧機能') + 'さらなる機能も開発中...')
            .setFooter({ text: `NoNICK.js v${version}`, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/965619643677040681/-3.png' })
            .setColor('WHITE')
            .setThumbnail(client.user.displayAvatarURL());
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
            .setLabel('バグ・問題を報告')
            .setStyle('LINK')
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/issues/new'),
        );
        interaction.reply({ embeds: [embed], components: [button], ephemeral:true });
    },
};

// このコマンドの動作の改変を禁止します。
// Copyright © 2022 NoNICK All Rights Reserved.