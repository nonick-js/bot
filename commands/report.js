const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('サーバー運営に通報')
        .setType(ApplicationCommandType.Message),
    async execute(interaction,client) {
        const modal = new Modal()
			.setCustomId('banidModal1')
			.setTitle('通報')
			.addComponents(
			new TextInputComponent()
				.setCustomId('textinput')
				.setLabel('このメッセージはサーバールールの何に違反していますか？詳しい情報を教えてください。')
				.setPlaceholder('できる限り詳しく入力してください。')
				.setStyle('LONG')
				.setRequired(true)
			);
		showModal(modal, {client, interaction});
    }
}