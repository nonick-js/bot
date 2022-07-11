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
    data: {
        name: "reportsetting",
        description: "通報機能の設定",
        type: "CHAT_INPUT",
        options: [
            {name: "reportch", description: "通報を受け取るチャンネル", type: "CHANNEL"}
        ]
    },
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
			const embed = new discord.MessageEmbed()
				.setColor('#E84136')
				.setDescription('あなたにはこのコマンドを使用する権限がありません！');
			return interaction.reply({embeds: [embed], ephemeral: true});
		}
    }
}