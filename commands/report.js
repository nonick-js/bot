const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Formatters, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('サーバー運営に通報')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
		const { reportCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
		if (reportCh == null) {
			if (interaction.member.permissions.has("MANAGE_GUILD")) {
				const embed = new MessageEmbed()
					.setDescription('⚠ **この機能を使用するには追加で設定が必要です。**\n' + Formatters.inlineCode('/setting') + 'で通報機能の設定を開き、レポートを受け取るチャンネルを設定してください。')
					.setColor('#526ff5')
				interaction.reply({embeds: [embed], ephemeral:true});
				return;
			} else {
				const embed = new MessageEmbed()
					.setDescription('⚠ **この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。')
					.setColor('#526ff5')
				interaction.reply({embeds: [embed], ephemeral:true});
				return;
			}
		}

		const reportedUser = interaction.targetMessage.author
		if (reportedUser.bot || reportedUser.system) {
			const embed = new MessageEmbed()
				.setDescription('BOT、Webhook、システムメッセージを通報することはできません!')
				.setColor('RED')
			interaction.reply({embeds: [embed], ephemeral:true});
			return;
		}

		const reportedMember = await interaction.guild.members.fetch(reportedUser);
		if (reportedMember == interaction.member) {
			interaction.reply({content: '自分自身を通報って...(困惑)', ephemeral:true});
			return;
		} else if (reportedMember.permissions.has("MANAGE_MESSAGES") ) {
			const embed = new MessageEmbed()
				.setDescription('このコマンドでサーバー運営者を通報することはできません!')
				.setColor('RED');
			interaction.reply({embeds: [embed], ephemeral:true});
			return;
		}

		const reportedMessage = interaction.targetMessage;

		const embed = new MessageEmbed()
			.setTitle('⚠ メッセージを通報')
			.setDescription('このメッセージを通報してもよろしいですか?' + Formatters.codeBlock('markdown','通報はこのサーバーの運営にのみ送信されます。\n無関係なメッセージの通報や通報の連投は処罰を受ける可能性があります。'))
			.setColor('RED')
			.setThumbnail(reportedUser.avatarURL())
			.addFields(
				{name: "投稿者", value: `${reportedUser}`, inline:true},
				{name: "投稿先", value: `${reportedMessage.channel} [リンク](${reportedMessage.url})`, inline:true}
			)
		
		if(reportedMessage.content) {
			embed.addFields({name: 'メッセージ', value: `${reportedMessage.content}`})
		}
		
		if(reportedMessage.attachments.first()) {
			const reportedMessageFile = reportedMessage.attachments.first();
			if(reportedMessageFile.height && reportedMessageFile.width) {
				embed.setImage(reportedMessageFile.url)
			}
		}
		
		const button = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('report')
				.setLabel('通報')
				.setEmoji('969148338597412884')
				.setStyle('DANGER')
		)
		interaction.reply({embeds: [embed], components: [button], ephemeral:true});
	}
}