const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const setting_module = require('../modules/setting');

module.exports = {
    async execute(interaction) {
        if (interaction.customId == 'setting1-enable') {
			const { welcome, welcomeCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (welcome) {
				setting_module.change_setting("welcome", false);
				interaction.reply({content: '🔴 入退室ログを**オフ**にしました。', ephemeral: true});
			} else {
				if(welcomeCh == null) {
					const embed = new MessageEmbed()
						.setDescription('**入退室ログを送信するチャンネルIDが指定されていません。**\nセレクトメニューから「送信先の変更」で設定してください。')
						.setColor('RED');
					interaction.reply({embeds: [embed], ephemeral:true}); 
					return;
				}
				setting_module.change_setting("welcome", true);
				interaction.reply({content: '🟢 入退室ログを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'setting1-restore') {
			setting_module.restore_welcome();
			interaction.reply({content: '💥 **設定を初期状態に復元しました。**', ephemeral:true});
		}

		if (interaction.customId == 'timeoutSetting-enable') {
			const { timeout } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (timeout) {
				setting_module.change_setting("timeout", false);
				interaction.reply({content: '🔴 TIMEOUTコマンドを**オフ**にしました。', ephemeral: true});
			} else {
				setting_module.change_setting("timeout", true);
				interaction.reply({content: '🟢 TIMEOUTコマンドを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'timeoutSetting-logEnable') {
			const { timeoutLog, timeoutLogCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (timeoutLog) {
				setting_module.change_setting("timeoutLog", false);
				interaction.reply({content: '🔴 タイムアウトログを**オフ**にしました。', ephemeral: true});
			} else {
				if(timeoutLogCh == null) {
					const embed = new MessageEmbed()
						.setDescription('**タイムアウトログを送信するチャンネルIDが指定されていません。**\nセレクトメニューから「送信先の変更」で設定してください。')
						.setColor('RED');
					interaction.reply({embeds: [embed], ephemeral:true}); 
					return;
				}
				setting_module.change_setting("timeoutLog", true);
				interaction.reply({content: '🟢 タイムアウトログを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'timeoutSetting-dmEnable') {
			const { timeoutDm, timeoutDmString } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (timeoutDm) {
				setting_module.change_setting("timeoutDm", false);
				interaction.reply({content: '🔴 タイムアウトした人への警告DMを**オフ**にしました。', ephemeral: true});
			} else {
				if(timeoutDmString == null) {
					const embed = new MessageEmbed()
						.setDescription('**警告DMに送信する内容が指定されていません。**\nセレクトメニューから「警告DMに送信するメッセージの変更」で設定してください。')
						.setColor('RED');
					interaction.reply({embeds: [embed], ephemeral:true}); 
					return;
				}
				setting_module.change_setting("timeoutDm", true);
				interaction.reply({content: '🟢 タイムアウトした人への警告DMを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'timeoutSetting-restore') {
			setting_module.restore_timeout();
			interaction.reply({content: '💥 **設定を初期状態に復元しました。**', ephemeral:true});
		}

		if (interaction.customId == 'banidSetting-enable') {
			const { banid } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (banid) {
				setting_module.change_setting("banid", false);
				interaction.reply({content: '🔴 BANIDコマンドを**オフ**にしました。', ephemeral: true});
			} else {
				setting_module.change_setting("banid", true);
				interaction.reply({content: '🟢 BANIDコマンドを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'banidSetting-logEnable') {
			const { banidLog, banidLogch } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (banidLog) {
				setting_module.change_setting("banidLog", false);
				interaction.reply({content: '🔴 BANIDログを**オフ**にしました。', ephemeral: true});
			} else {
				if(banidLogch == null) {
					const embed = new MessageEmbed()
						.setDescription('**BANIDログを送信するチャンネルIDが指定されていません。**\nセレクトメニューから「送信先の変更」で設定してください。')
						.setColor('RED');
					interaction.reply({embeds: [embed], ephemeral:true}); 
					return;
				}
				setting_module.change_setting("banidLog", true);
				interaction.reply({content: '🟢 BANIDログを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'banidSetting-restore') {
			setting_module.restore_banid();
			interaction.reply({content: '💥 **設定を初期状態に復元しました。**', ephemeral:true});
		}
    }
}