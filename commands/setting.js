const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
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
	async execute(interaction) {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはこの設定を管理する権限がありません！')
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
        const command_string1 = interaction.options.getString('item');
        if (command_string1 == 'setting1') {
            const embed = new MessageEmbed()
            .setTitle('🛠 設定 - 入退室ログ')
            .setDescription('入退室ログの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、入退室ログの機能をON/OFFに切り替えたい場合は下のボタンを押そう!')
            .setColor('#57f287');

            const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('setting1-enable')
                .setLabel(`有効/無効化`)
                .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('setting1-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            );

            const select = new MessageActionRow() 
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('setting1')
					.setPlaceholder('ここから選択')
					.addOptions([
						{
							label: 'ログを送信するチャンネルの変更',
							value: 'setting1-1',
						},
						{
							label: '入退室ログに載せるメッセージの変更',
							value: 'setting1-2',
						}
					]),
			);
            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }
	},
}; 