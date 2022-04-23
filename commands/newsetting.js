const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('newsetting')
		.setDescription('このBOTのコントロールパネル(設定)を開きます。'),
    async execute(interaction) {
    }
}