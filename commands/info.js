const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Message } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('このBOTの情報を表示します。'),
	async execute(interaction) {
        const bot_name = interaction.guild.me.user.username;
        const bot_avatarURL = interaction.guild.me.user.avatarURL();
        const embed = new MessageEmbed()
            .setTitle(bot_name)
            .setDescription('「分かりやすい」をモットーにした多機能BOT\n**こんな機能が使えるよ!**\n> 🔸入退室ログ機能\n> 🔹TIMEOUTコマンド')
            .setFooter({text: 'このBOTはNoNICK作成の「NoNICK.js」で開発されたコードで動作しています。', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/965619643677040681/-3.png'})
            .setColor('WHITE')
            .setThumbnail(bot_avatarURL);
        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel('Github')
            .setStyle('LINK')
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js'),
        )
        .addComponents(
            new MessageButton()
            .setLabel('バグ・問題を報告')
            .setStyle('LINK')
            .setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/issues')
        );
        interaction.reply({embeds: [embed], components: [button], ephemeral:true});
    }
}