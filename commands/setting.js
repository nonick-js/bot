const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('このBOTの設定を行います')
        .addStringOption(option0 =>
			option0.setName('item')
				.setDescription('設定する項目を選択してください。')
				.setRequired(true)
		),
	async execute(interaction,client) {
	},
};