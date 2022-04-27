const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Formatters } = require('discord.js');
module.exports = {
data: new ContextMenuCommandBuilder()
        .setName('テスト')
        .setType(ApplicationCommandType.User),
	async execute(interaction) {
                interaction.reply('テスト')
        }
}