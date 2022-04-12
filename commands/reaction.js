const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reacitonrole')
		.setDescription('リアクションロールが可能な埋め込みを送信します'),
	async execute(interaction,client) {
        if (!interaction.member.permissions.has("MANAGE_ROLES")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはリアクションロールを管理する権限がありません！')
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
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