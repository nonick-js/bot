const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    async execute(modal,client) {
        await modal.deferReply({ephemeral: true});

        const embed = modal.message.embeds?.[0];
        const embedfield = modal.message.embeds?.[0]?.fields;
        const reportedMessageAuthor = await client.users.fetch(embedfield[0].value.replace(/^../g, '').replace(/.$/, ''))
		const reportedMessageCh = embedfield[1].value;

        const reportUser = modal.user;
        const reportReason = modal.getTextInputValue('textinput');

        const reportEmbed = new discord.MessageEmbed()
            .setTitle('⚠ 通報')
            .setDescription(`通報者: ${reportUser}\n` + discord.Formatters.codeBlock(`通報理由: ` + `${reportReason}`))
            .setThumbnail(reportedMessageAuthor.avatarURL())
            .addFields(
                {name: '投稿者', value: `${reportedMessageAuthor}`, inline:true},
                {name: '投稿先', value: `${reportedMessageCh}`, inline:true }
            )
            .setColor('RED');

        if(embedfield[2].value) {
            reportEmbed.addFields({name: "メッセージ", value: `${embedfield[2].value}`});
        }
            
        if(embed.image) {
            reportEmbed.setImage(embed.image.url);
        }

        const { reportCh, reportRoleMention, reportRole } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
        if (reportRoleMention) {
            client.channels.cache.get(reportCh).send({content: `<@&${reportRole}>` ,embeds: [reportEmbed]})
            modal.followUp({content: "**報告ありがとうございます!** 通報をサーバー運営に送信しました!", ephemeral:true});
        } else {
            client.channels.cache.get(reportCh).send({embeds: [reportEmbed]})
            modal.followUp({content: "**報告ありがとうございます!** 通報をサーバー運営に送信しました!", ephemeral:true});
        } 
    }
}