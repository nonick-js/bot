const discordmodals = require('discord-modals');

module.exports = {
    async execute(interaction,client) {
        if (interaction.customId == 'welcomeSetting') {
			if (interaction.values == 'welcomeSetting1') {
				const modal = new discordmodals.Modal()
				.setCustomId('modal_setting1-2')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入退室ログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				discordmodals.showModal(modal, {client, interaction});
			}
			if (interaction.values == 'welcomeSetting2') {
				const modal = new discordmodals.Modal()
				.setCustomId('modal_setting1-3')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入室時埋め込みに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
					.setRequired(true)
				);
				discordmodals.showModal(modal, {client, interaction});
			}
		}

		if (interaction.customId == 'timeoutSetting') {
			if (interaction.values == 'timeoutSetting1') {
				const modal = new discordmodals.Modal()
				.setCustomId('timeoutModal1')
				.setTitle('設定 - timeoutコマンド')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('タイムアウトログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				discordmodals.showModal(modal, {client, interaction});
			}
			if (interaction.values == 'timeoutSetting2') {
				const modal = new discordmodals.Modal()
				.setCustomId('timeoutModal2')
				.setTitle('設定 - timeoutコマンド')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('警告DMに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('どのサーバーでタイムアウトされたか分かりやすいように、サーバー名を入れることをおすすめします。')
					.setRequired(true)
				);
				discordmodals.showModal(modal, {client, interaction});
			}
		}

		if (interaction.customId == 'banidSetting') {
			if (interaction.values == 'banidSetting1') {
				const modal = new discordmodals.Modal()
				.setCustomId('banidModal1')
				.setTitle('設定 - banidコマンド')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('タイムアウトログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				discordmodals.showModal(modal, {client, interaction});
			}
		}

		if (interaction.customId == 'reportSetting') {
			if (interaction.values == 'reportSetting1') {
				const modal = new discordmodals.Modal()
				.setCustomId('reportModal1')
				.setTitle('設定 - 通報機能')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('レポートを受け取るチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				discordmodals.showModal(modal, {client, interaction});
			}
			if (interaction.values == 'reportSetting2') {
				const modal = new discordmodals.Modal()
				.setCustomId('reportModal2')
				.setTitle('設定 - 通報機能')
				.addComponents(
				new discordmodals.TextInputComponent()
					.setCustomId('textinput')
					.setLabel('レポート時にメンションするロールの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				discordmodals.showModal(modal, {client, interaction});
			}
		}
    }
}