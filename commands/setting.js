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
                .addChoice('入退室ログ','setting1')
				.setRequired(true)
		),
	async execute(interaction,client) {
        if (!interaction.member.permissions.has("MANAGE_ROLES")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはリアクションロールを管理する権限がありません！')
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
        const command_string1 = interaction.options.getString('setting1');
        
        if () {

        }
	},
};