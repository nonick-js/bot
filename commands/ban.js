const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ユーザーをBANします。')
		.addSubcommand(subcommand => 
			subcommand
				.setName('id')
				.setDescription('ユーザーをIDでBAN')
				.addStringOption(option0 =>
					option0.setName('userid')
						.setDescription('BAN 対象のユーザーID')	
						.setRequired(true)
				)
				.addNumberOption(option2 =>
					option2.setName('delete_messages')	
						.setDescription('最近のメッセージ履歴をどこまで削除するか')
						.addChoice('削除しない', 0)
						.addChoice('過去24時間', 1)
						.addChoice('過去7日', 7)
						.setRequired(true)
				)
				.addStringOption(option3 => 
					option3.setName('reason')
						.setDescription('BANする理由')
				),
		),
	async execute(interaction) {
    }
}