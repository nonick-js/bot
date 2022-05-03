const discord = require('discord.js');
const error_embed = new discord.MessageEmbed()
	.setTitle('🛑 おっと...')
	.setDescription('処理の実行中に問題が発生しました。\n何度も同じエラーが発生する場合、以下のボタンからエラーコードと共に報告してください。')
	.setColor('RED')
const error_button = new discord.MessageActionRow().addComponents(
	new discord.MessageButton()
	.setLabel('問題を報告')
	.setStyle('LINK')
	.setURL('https://github.com/nonick-mc/DiscordBot-NoNick.js/issues/new')
)

exports.interactionError = () => {
    error_embed.setFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
	interaction.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
}

exports.modalError = () => {
    error_embed.setFields({name: "エラー", value: `${discord.Formatters.codeBlock(error)}`});
	modal.reply({embeds: [error_embed], components: [error_button], ephemeral:true});
}