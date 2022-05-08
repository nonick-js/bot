const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    async execute(modal,client) {
        if (modal.customId == 'reportModal') {
            const { reportCh, reportRoleMention, reportRole } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
            const embed = modal.message.embeds[0];
            const reportedMessageAuthor = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''))
            const reportedMessageCh = embed.fields[1].value;
            const reportUser = modal.user;
            const reportReason = modal.getTextInputValue('textinput');
            const reportEmbed = new discord.MessageEmbed()
                .setTitle('⚠ 通報')
                .setDescription(`通報者: ${reportUser}\n` + discord.Formatters.codeBlock(`${reportReason}`))
                .setThumbnail(reportedMessageAuthor.avatarURL())
                .addFields(
                    {name: '投稿者', value: `${reportedMessageAuthor}`, inline:true},
                    {name: '投稿先', value: `${reportedMessageCh}`, inline:true }
                )
                .setColor('RED');
            if(embed.fields[2].value) reportEmbed.addFields({name: "メッセージ", value: `${embed.fields[2].value}`});
            if(embed.image) reportEmbed.setImage(embed.image.url);
            if (reportRoleMention) {
                client.channels.cache.get(reportCh).send({content: `<@&${reportRole}>`, embeds: [reportEmbed]});
            } else {
                client.channels.cache.get(reportCh).send({embeds: [reportEmbed]});
            }        
            modal.update({content: "**報告ありがとうございます!** 通報をサーバー運営に送信しました!", embeds: [], components: [], ephemeral:true});
        }
    }
}