const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Formatters } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('このBOTの設定を行います。')
        .addStringOption(option0 =>
			option0.setName('item')
			    .setDescription('設定する項目を選択してください。')
                .addChoice('🚪 入退室ログ','welcomeSetting')
                .addChoice('📢 通報機能','reportSetting')
                .addChoice('💬 timeoutコマンド', 'timeoutSetting')
                .addChoice('💬 banidコマンド', 'banidSetting')
				.setRequired(true)
		),
	async execute(interaction) {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('**あなたにはこの設定を管理する権限がありません！**\n必要な権限: サーバー管理');
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
        const command_string1 = interaction.options.getString('item');

        if (command_string1 == 'welcomeSetting') {
            const embed = new MessageEmbed()
                .setTitle('🛠 設定 - 入退室ログ')
                .setDescription('入退室ログの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!' + Formatters.codeBlock('markdown','#入退室ログとは...\nサーバーに新しくメンバーが参加した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。'))
                .setColor('#57f287');
            const select = new MessageActionRow().addComponents([
			    new MessageSelectMenu()
				.setCustomId('welcomeSetting')
				.setPlaceholder('ここから選択')
				.addOptions([
					{ label: '送信先の変更', description: 'ここに入退室ログが送信されます。', value: 'welcomeSetting1', emoji: '966588719635267624' },
					{ label: 'メッセージの変更', description: '最初に見てほしいチャンネル等を紹介しよう!', value: 'welcomeSetting2', emoji: '966596708458983484' },
				]),
            ]);
            const button = new MessageActionRow().addComponents([
                new MessageButton()
                .setCustomId('setting1-enable')
                .setEmoji('967445747735879770')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('setting1-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            ]);
            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }

        if (command_string1 == 'reportSetting') {
            const embed = new MessageEmbed()
                .setTitle('🛠 設定 - 通報機能')
                .setDescription('通報機能の設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!' + Formatters.codeBlock('markdown', '通報機能とは...\nメンバーがサーバールール等に違反しているメッセージを通報できる機能です。\nモデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。\n'))
                .setColor('GREEN');
            const select = new MessageActionRow().addComponents([
                new MessageSelectMenu()
                .setCustomId('reportSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: 'レポートを受け取るチャンネルの変更', description: '運営のみ見れるチャンネルを選択しよう!' , value: 'reportSetting1', emoji: '966588719635267624' },
					// { label: 'メンションするロールの変更', description: 'このロールがメンションされます。', value: 'reportSetting2', emoji: '966588719635263539' },
		        ]),
            ])
            const button = new MessageActionRow().addComponents([
                new MessageButton()
                .setCustomId('reportSetting-mentionEnable')
                .setLabel('メンション')
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('reportSetting-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            ]);
            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }

        if (command_string1 == 'timeoutSetting') {
            const embed = new MessageEmbed()
                .setTitle('🛠 設定 - TIMEOUTコマンド')
                .setDescription('TIMEOUTコマンドの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!' + Formatters.codeBlock('markdown', '#TIMEOUTコマンドとは...\nサーバーにいるメンバーにタイムアウト(ミュート)を設定させるコマンドです。公式の機能より細かく設定させることができ、一分単位での調整が可能です。\n'))
                .setColor('GREEN');
            const select = new MessageActionRow().addComponents([
                new MessageSelectMenu()
                .setCustomId('timeoutSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: 'ログを送信するチャンネルの変更', description: '運営のみ見れるチャンネルを選択しよう!' , value: 'timeoutSetting1', emoji: '966588719635267624' },
					{ label: '警告DMに送信するメッセージの変更', description: '処分に関する注意を記述しよう!', value: 'timeoutSetting2', emoji: '966596708458983484' },
		        ]),
            ]);
            const button = new MessageActionRow().addComponents([
                new MessageButton()
                .setCustomId('timeoutSetting-enable')
                .setEmoji('967445747735879770')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('timeoutSetting-logEnable')
                .setLabel('ログ')
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('timeoutSetting-dmEnable')
                .setLabel('警告DM')
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('timeoutSetting-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            ]);
            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }

        if (command_string1 == 'banidSetting') {
            const embed = new MessageEmbed()
                .setTitle('🛠 設定 - BANIDコマンド')
                .setDescription('BANIDコマンドの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!' + Formatters.codeBlock('markdown','#BANIDコマンドとは...\nサーバーにいないユーザーをIDのみでBANできる機能です。荒らしをして抜けていったメンバーの追加処分や、他コミュニティで荒らしをしたユーザーの対策に有効です。'))
                .setColor('GREEN');
            const select = new MessageActionRow().addComponents([
                new MessageSelectMenu()
                .setCustomId('banidSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: 'ログを送信するチャンネルの変更', description: '運営のみ見れるチャンネルを選択しよう!' , value: 'banidSetting1', emoji: '966588719635267624' },
                    ]),
                ]);
            const button = new MessageActionRow().addComponents([
                new MessageButton()
                .setCustomId('banidSetting-enable')
                .setEmoji('967445747735879770')
                .setStyle('PRIMARY'),
                new MessageButton()
                .setCustomId('banidSetting-logEnable')
                .setLabel('ログ')
                .setStyle('SECONDARY'),
                new MessageButton()
                .setCustomId('banidSetting-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            ]);
            interaction.reply({embeds: [embed], components: [select, button], ephemeral:true});
        }
	},
}; 