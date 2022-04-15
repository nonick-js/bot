const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('このBOTの設定を行います')
        .addStringOption(option0 =>
			option0.setName('item')
				.setDescription('設定する項目を選択してください。')
                .addChoice('入退室ログ','setting1')
				.setRequired(true)
		),
	async execute(interaction,client) {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) {
            const embed = new MessageEmbed()
                .setColor('#E84136')
                .setDescription('あなたにはこの設定を管理する権限がありません！')
            interaction.reply({embeds: [embed], ephemeral: true});
            return;
        }
        const command_string1 = interaction.options.getString('item');
        if (command_string1 == 'setting1') {
            const embed = new MessageEmbed()
            .setTitle('設定 - 入退室ログ')
            .setDescription('入退室ログの設定を以下のボタンから行えます。')
            .setColor('#57f287')

            const button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('setting1-1')
                .setLabel('有効/無効')
                .setStyle('SECONDARY'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('setting1-2')
                .setLabel('送信先の変更')
                .setStyle('SECONDARY')
            )
            .addComponents(
                new MessageButton()
                .setCustomId('setting1-3')
                .setLabel('メッセージの設定')
                .setStyle('SECONDARY'),
            )
            .addComponents(
                new MessageButton()
                .setCustomId('setting1-4')
                .setLabel('設定の初期化')
                .setStyle('DANGER'),
            );
            interaction.reply({embeds: [embed], components: [button]});
        }
	},
}; 