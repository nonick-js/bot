const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reacitonrole')
		.setDescription('リアクションロールが可能な埋め込みを送信します'),
	async execute(interaction) {
		interaction.reply('Pong!');
	},
};