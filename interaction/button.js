const fs = require('fs');
const setting_module = require('../modules/setting');

module.exports = {
    async execute(interaction) {
        if (interaction.customId == 'setting1-enable') {
			const { welcome, welcomeCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (welcome) {
				setting_module.change_setting("welcome", false);
				interaction.reply({content: '入退室ログを**オフ**にしました。', ephemeral: true});
			} else {
				if(welcomeCh == null) {interaction.reply({content: '**入退室ログを送信するチャンネルIDが指定されていません。**\nセレクトメニュー→「ログを送信するチャンネルの変更」から設定してください。', ephemeral:true}); return;}
				setting_module.change_setting("welcome", true);
				interaction.reply({content: '入退室ログを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'setting1-restore') {
			setting_module.restore_welcome();
			interaction.reply({content: '💥 **設定を初期状態に復元しました。**', ephemeral:true});
		}

		if (interaction.customId == 'timeoutSetting-logEnable') {
			const { timeoutLog, timeoutLogCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (timeoutLog) {
				setting_module.change_setting("timeoutLog", false);
				interaction.reply({content: 'タイムアウトログを**オフ**にしました。', ephemeral: true});
			} else {
				if(timeoutLogCh == null) {interaction.reply({content: '**タイムアウトログを送信するチャンネルIDが指定されていません。**\nセレクトメニュー→「ログを送信するチャンネルの変更」から設定してください。', ephemeral:true}); return;}
				setting_module.change_setting("timeoutLog", true);
				interaction.reply({content: 'タイムアウトログを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'timeoutSetting-dmEnable') {
			const { timeoutDm, timeoutDmString } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
			if (timeoutDm) {
				setting_module.change_setting("timeoutDm", false);
				interaction.reply({content: 'タイムアウトした人への警告DMを**オフ**にしました。', ephemeral: true});
			} else {
				if(timeoutDmString == null) {interaction.reply({content: '**警告DMに送信する内容が指定されていません。**\nセレクトメニュー→「警告DMに送信するメッセージの変更」から設定してください。', ephemeral:true}); return;}
				setting_module.change_setting("timeoutDm", true);
				interaction.reply({content: 'タイムアウトした人への警告DMを**オン**にしました。', ephemeral: true});
			}
		}
		if (interaction.customId == 'timeoutSetting-restore') {
			setting_module.restore_timeout();
			interaction.reply({content: '💥 **設定を初期状態に復元しました。**', ephemeral:true});
		}
    }
}