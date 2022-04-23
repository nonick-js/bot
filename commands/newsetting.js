const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('このBOTの設定を行います。')
        .addStringOption(option0 =>
			option0.setName('item')
			    .setDescription('設定する項目を選択してください。')
                .addChoice('[機能] 入退室ログ','setting1')
                .addChoice('[コマンド] timeout', 'timeoutSetting')
				.setRequired(true)
		),
	async execute(interaction) {