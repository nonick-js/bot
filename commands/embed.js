const discord = require('discord.js');
const discordmodal = require('discord-modals');

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
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {name: "embed", description: "埋め込みメッセージを送信" ,type: "CHAT_INPUT"},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
		const modal = new discordmodal.Modal()
			.setCustomId('modal-embed')
			.setTitle('埋め込み')
			.addComponents(
                new discordmodal.TextInputComponent()
                    .setCustomId('title')
                    .setLabel('タイトル')
                    .setMaxLength(256)
                    .setRequired(true)
                    .setStyle('SHORT'),
                new discordmodal.TextInputComponent()
                    .setCustomId('description')
                    .setLabel('説明')
                    .setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
                    .setMaxLength(4000)
                    .setRequired(true)
                    .setStyle('LONG'),
                new discordmodal.TextInputComponent()
                    .setCustomId('color')
                    .setLabel('カラーコード')
                    .setPlaceholder('#は不要です')
                    .setMaxLength(6)
                    .setStyle('SHORT'),
                new discordmodal.TextInputComponent()
                    .setCustomId('image')
                    .setLabel('画像URL')
                    .setStyle('SHORT'),
                new discordmodal.TextInputComponent()
                    .setCustomId('footer')
                    .setLabel('フッター')
                    .setMaxLength(100)
                    .setStyle('SHORT')
            );
		discordmodal.showModal(modal, {client, interaction});
    }
}