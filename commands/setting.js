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
                .addChoice('🚪 入退室ログ','welcomeSetting')
                .addChoice('🛠 timeoutコマンド', 'timeoutSetting')
                .addChoice('🛠 banidコマンド', 'banidSetting')
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
        if (command_string1 == 'welcomeSetting') {
            const embed = new MessageEmbed()
                .setTitle('🛠 設定 - 入退室ログ')
                .setDescription('入退室ログの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!')
                .setColor('#57f287');
            const select = new MessageActionRow().addComponents([
			new MessageSelectMenu()
				.setCustomId('welcomeSetting')
				.setPlaceholder('ここから選択')
				.addOptions([
					{ label: '送信先の変更', description: 'ここに入退室ログが送信されます', value: 'welcomeSetting1', emoji: '966588719635267624' },
					{ label: 'メッセージの変更', description: '最初に見てほしいチャンネル等を紹介しましょう', value: 'welcomeSetting2', emoji: '966596708458983484' },
				]),
            ]);
            const button = new MessageActionRow().addComponents([
                new MessageButton()
                .setCustomId('setting1-enable')
                .setLabel(`入退室ログ`)
                .setEmoji('967445747735879770')
                .setStyle('SUCCESS'),
                new MessageButton()
                .setCustomId('setting1-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            ]);
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