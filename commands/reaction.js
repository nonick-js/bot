const { SlashCommandBuilder } = require('@discordjs/builders');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reacitonrole')
		.setDescription('リアクションロールが可能な埋め込みを送信します'),
	async execute(interaction,client) {
		const modaltest = new Modal()
            .setCustomId('reactionmodal')
            .setTitle('リアクションロール')
            .addComponents(
            new TextInputComponent()
                .setCustomId('textinput-title')
                .setLabel('タイトル')
                .setStyle('SHORT')
                .setRequired(true)
                )
            .addComponents(
            new TextInputComponent()
                .setCustomId('textinput-description')
                .setLabel('説明')
                .setStyle('LONG')
                .setPlaceholder('<#チャンネルID> <@ユーザーID> <@&ロールID> で埋め込み内でメンションができます。')
                .setRequired(true)
            );         
        showModal(modaltest, {client, interaction});
	},
};