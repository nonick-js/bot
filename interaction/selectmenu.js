const { Modal, TextInputComponent, showModal } = require('discord-modals');
const { MessageEmbed } = require('discord.js');

module.exports = {
    async execute(interaction,client) {
        if (interaction.customId == 'welcomeSetting') {
			if (interaction.values == 'welcomeSetting1') {
				const modal = new Modal()
				.setCustomId('modal_setting1-2')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入退室ログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				showModal(modal, {client, interaction});
			}
			if (interaction.values == 'welcomeSetting2') {
				const modal = new Modal()
				.setCustomId('modal_setting1-3')
				.setTitle('設定 - 入退室ログ')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('入室時埋め込みに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
					.setRequired(true)
				);
				showModal(modal, {client, interaction});
			}
		}

		if (interaction.customId == 'timeoutSetting') {
			if (interaction.values == 'timeoutSetting1') {
				const modal = new Modal()
				.setCustomId('timeoutModal1')
				.setTitle('設定 - timeoutコマンド')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('タイムアウトログを送信するチャンネルの名前を入力してください。')
					.setStyle('SHORT')
					.setMaxLength(100)
					.setRequired(true)
				);  
				showModal(modal, {client, interaction});
			}
			if (interaction.values == 'timeoutSetting2') {
				const modal = new Modal()
				.setCustomId('timeoutModal2')
				.setTitle('設定 - timeoutコマンド')
				.addComponents(
				new TextInputComponent()
					.setCustomId('textinput')
					.setLabel('警告DMに表示するメッセージを入力してください。')
					.setStyle('LONG')
					.setPlaceholder('どのサーバーでタイムアウトされたか分かりやすいように、サーバー名を入れることをおすすめします。')
					.setRequired(true)
				);
				showModal(modal, {client, interaction});
			}
		}
    }
}