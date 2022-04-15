const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('enquete')
		.setDescription('アンケートが可能な埋め込みを送信します。')
        .addStringOption(option0 =>
			option0.setName('title')
				.setDescription('アンケートのタイトルを入力してください。')
				.setRequired(true)
		)
        .addStringOption(option1 =>
            option1.setName('secret')
                .setDescription('投票数、投票状況を非公開にするか設定してください。')
                .addChoice('true (非公開)','true')
                .addChoice('false (公開)','false')
                .setRequired(true)
        )
        .addStringOption(option2 =>
            option2.setName('item1')
                .setDescription('1つ目の項目を入力してください。')
                .setRequired(true)
        )
        .addStringOption(option3 =>
            option3.setName('item2')
                .setDescription('2つ目の項目を入力してください。')
                .setRequired(true)
        )
        .addStringOption(option4 =>
            option4.setName('item3')
                .setDescription('3つ目の項目を入力してください。')
        )
        .addStringOption(option5 =>
            option5.setName('item4')
                .setDescription('4つ目の項目を入力してください。')
        )
        .addStringOption(option6 =>
            option6.setName('item5')
                .setDescription('5つ目の項目を入力してください。')
        ),
	async execute(interaction,client) {
        const command_string1 = interaction.options.getString('title');
        const command_string2 = interaction.options.getString('secret');
        const command_string3 = interaction.options.getString('item1');
        const command_string4 = interaction.options.getString('item2');
        // const command_string5 = interaction.options.getString('item3');
        // const command_string6 = interaction.options.getString('item4');
        // const command_string7 = interaction.options.getString('item5');
        const string = command_string3 + command_string4;

        const embed = new MessageEmbed()
            .setTitle(command_string1)
            .setDescription(string);
        interaction.reply({embed: [embed]});
	},
};