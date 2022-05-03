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
    data: {name: "setting", description: "BOTのコントロールパネルを開きます"},
    /**@type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = new discord.MessageEmbed()
            .setTitle('🛠 NoNICK.js コントロールパネル')
            .setDescription('NoNICK.jsのコントロールパネルへようこそ!\nここではこのBOTの設定を変更することができます!' + discord.Formatters.codeBlock("markdown", "セレクトメニューから閲覧・変更したい設定を選択しよう!"))
            .setColor('GREEN');
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
                .setCustomId('setting-control-whatsnew')
                .setLabel("What's New")
                .setEmoji('966588719643631666'),
            new discord.MessageButton()
                .setCustomId('setting-control-laungage')
                .setEmoji('🌐')
        );
        const select = new discord.MessageActionRow().addComponents(
            new discord.MessageSelectMenu()
                .setCustomId('setting-control-')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: '送信先の変更', description: 'ここに入退室ログが送信されます。', value: 'welcomeSetting1', emoji: '966588719635267624' },
                    { label: 'メッセージの変更', description: '最初に見てほしいチャンネル等を紹介しよう!', value: 'welcomeSetting2', emoji: '966596708458983484' },
                ]),
        );
        interaction.reply({embeds: [embed], components: [button, select], ephemetal: true});
    }
}