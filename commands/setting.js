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
                .addChoice('🎒入退室ログ','setting1')
                .addChoice('💬timeoutコマンド', 'timeoutSetting')
				.setRequired(true)
		),
	async execute(interaction) {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('**あなたにはこの設定を管理する権限がありません！**\n必要な権限: サーバー管理');
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
        const command_string1 = interaction.options.getString('item');
        if (command_string1 == 'setting1') {
            const embed = new MessageEmbed()
            .setTitle('🛠 設定 - 入退室ログ')
            .setDescription('入退室ログの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!')
            .setColor('#57f287');

            const select = new MessageActionRow() 
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('setting1')
					.setPlaceholder('ここから選択')
					.addOptions([
						{
							label: 'ログを送信するチャンネルの変更',
							value: 'setting1-2',
                            emoji: '📃',
						},
						{
							label: '入室時ログに送信するメッセージの変更',
							value: 'setting1-3',
                            emoji: '📨',
						},
					]),
			);

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
            
            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }

        if (command_string1 == 'timeoutSetting') {
            const embed = new MessageEmbed()
                .setTitle('🛠 設定 - Timeoutコマンド')
                .setDescription('Timeoutコマンドの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!')
                .setColor('#57f287');
            
            const select = new MessageActionRow()
            .addComponents(
				new MessageSelectMenu()
					.setCustomId('timeoutSetting')
					.setPlaceholder('ここから選択')
					.addOptions([
						{
							label: 'ログを送信するチャンネルの変更',
							value: 'timeoutSetting1',
                            emoji: '📃',
						},
						{
							label: '警告DMに送信するメッセージの変更',
							value: 'timeoutSetting2',
                            emoji: '📨',
						},
					]),
			);

            const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('timeoutSetting-logEnable')
                    .setLabel('ログを有効化/無効化')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('timeoutSetting-dmEnable')
                    .setLabel('警告DMを有効化/無効化')
                    .setStyle('PRIMARY'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('timeoutSetting-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            );

            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }
	},
}; 