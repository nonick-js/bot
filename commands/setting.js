const discord = require('discord.js');

/**
 * @callback InteractionCallback
 * @param {discord.MessageContextMenuInteraction} interaction
 * @param {discord.Client} client
 * @returns {void}
 */
/**
 * @typedef ContextMenuData
 * @prop {string} customid
 * @prop {"BUTTON"|"SELECT_MENU"} type
 */

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {name: "setting", description: "BOTのコントロールパネル(設定)を開きます", type: 'CHAT_INPUT'},
    /**@type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = new discord.MessageEmbed()
            .setTitle('🛠 NoNICK.js - 設定')
            .setDescription('NoNICK.jsのコントロールパネルへようこそ!\nここではこのBOTの設定を変更することができます!' + discord.Formatters.codeBlock("markdown", "セレクトメニューから閲覧・変更したい設定を選択しよう!"))
            .setColor('GREEN');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-control-whatsnew')
                .setLabel("What's New")
                .setEmoji('966588719643631666')
                .setStyle('PRIMARY'),
            new discord.MessageButton()
                .setCustomId('setting-control-laungage')
                .setEmoji('🌐')
                .setStyle('SECONDARY')
        );
        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('setting-control-')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: '通報機能', value: 'setting-control-report', emoji: '966588719635267624' },
                ]),
        );
        interaction.reply({embeds: [embed], components: [select, button], ephemetal: true});
    }
}