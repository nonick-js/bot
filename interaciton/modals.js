const fs = require('fs');
const discord = require('discord.js');
const embed_MissingPermission = new discord.MessageEmbed()
    .setDescription(`**BOTの権限が不足しています!**\n送信先に指定しようとしているチャンネルの「チャンネルを見る」「メッセージを送信」「埋め込みリンク」権限をBOTに付与してください。`)
    .setColor('RED');
const embed_channelNotFound = new discord.MessageEmbed()
    .setDescription('**チャンネルが存在しません!**\n正しいチャンネル名を入力してください。\n注意:大文字小文字、空白も正しく入力する必要があります。')
    .setColor('RED');

module.exports = {
    async execute(modal, client, Configs) {
        const config = await Configs.findOne({where: {serverId: modal.guild.id}});

        if (modal.customId == 'modal-setting-reportCh') {
            const string = modal.getTextInputValue('textinput');
            const embed = modal.message.embeds[0];
            const select = modal.message.components[0];
            const button = modal.message.components[1];
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
                const successembed = new discord.MessageEmbed()
                    .setDescription('✅ 受け取った通報がここに送信されます!')
                    .setColor('GREEN');
                client.channels.cache.get(messageId).send({embeds: [successembed]})
                    .then(() => {  
                        Configs.update({reportCh: messageId}, {where: {serverId: modal.guildId}});
                        embed.spliceFields(0, 1, {name: '通報の送信先', value: discord.Formatters.channelMention(messageId), inline: true});
                        button.components[1].setDisabled(false);
                        modal.update({embeds: [embed], components: [select, button], ephemeral: true})
                    })
                    .catch(async () => {
                        await modal.deferReply({ephemeral: true});
                        modal.followUp({ embeds: [embed_MissingPermission], ephemeral: true });
                    })
            } catch {
                await modal.deferReply({ephemeral: true});
                modal.followUp({ embeds: [embed_channelNotFound], ephemeral: true });
            }
        }

        if (modal.customId == 'modal-setting-reportRole') {
            const config = await Configs.findOne({where: {serverId: modal.guild.id}});
            const reportRoleMention = config.get('reportRoleMention');
            const string = modal.getTextInputValue('textinput');
            const embed = modal.message.embeds[0];
            const select = modal.message.components[0];
            const button = modal.message.components[1];
            try {
                const roleId = modal.guild.roles.cache.find((role) => role.name === string).id
                Configs.update({reportRole: roleId}, {where: {serverId: modal.guildId}});
                button.components[1].setDisabled(false);
                if (reportRoleMention) embed.spliceFields(1, 1, {name: 'ロールメンション', value: discord.Formatters.formatEmoji('758380151544217670')+' 有効化中' + '('+ discord.Formatters.roleMention(roleId) +')', inline:true});
                modal.update({embeds: [embed], components: [select, button], ephemeral:true});
            }
            catch {
                const embed = new discord.MessageEmbed()
                    .setDescription('指定されたロールが見つかりませんでした。正しい名前を入力してください。\n注意:大文字小文字、空白も正しく入力する必要があります。')
                    .setColor('RED')
                await modal.deferReply({ephemeral: true});
                modal.followUp({embeds: [embed], ephemeral:true});
            }
        }

        if (modal.customId == 'modal-setting-timeoutLogCh') {
            const config = await Configs.findOne({where: {serverId: modal.guild.id}});
            const timeoutLog = config.get('timeoutLog');
            const string = modal.getTextInputValue('textinput');
            const embed = modal.message.embeds[0];
            const select = modal.message.components[0];
            const button = modal.message.components[1];
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
                const successembed = new discord.MessageEmbed()
                    .setDescription('✅ /timeoutコマンドのログがここに送信されます!')
                    .setColor('GREEN');
                client.channels.cache.get(messageId).send({embeds: [successembed]})
                    .then(() => {  
                        Configs.update({timeoutLogCh: messageId}, {where: {serverId: modal.guildId}});
                        if (timeoutLog) embed.spliceFields(0, 1, {name: 'ログ機能', value: discord.Formatters.formatEmoji('758380151544217670')+' 有効化中' + '('+ discord.Formatters.channelMention(messageId) +')', inline:true});
                        button.components[1].setDisabled(false);
                        modal.update({embeds: [embed], components: [select, button], ephemeral: true})
                    })
                    .catch(async () => {
                        await modal.deferReply({ephemeral: true});
                        modal.reply({ embeds: [embed_MissingPermission], ephemeral: true });
                    })
            } catch {
                await modal.deferReply({ephemeral: true});
                modal.followUp({ embeds: [embed_channelNotFound], ephemeral: true });
            }
        }

        if (modal.customId == 'modal-report') {
            const config = await Configs.findOne({where: {serverId: modal.guild.id}});
            const reportRoleMention = config.get('reportRoleMention');
            const reportCh = config.get('reportCh');
            const reportRole = config.get('reportRole');
            
            const embed = modal.message.embeds[0];
            const reportedMessageAuthor = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''))
            const reportedMessageCh = embed.fields[1].value;
            const reportUser = modal.user;
            const reportReason = modal.getTextInputValue('textinput');
            const reportEmbed = new discord.MessageEmbed()
                .setTitle('⚠ 通報 (メッセージ)')
                .setDescription(`通報者: ${reportUser}\n` + discord.Formatters.codeBlock(`${reportReason}`))
                .setThumbnail(reportedMessageAuthor.displayAvatarURL())
                .addFields(
                    {name: '投稿者', value: `${reportedMessageAuthor}`, inline:true},
                    {name: '投稿先', value: `${reportedMessageCh}`, inline:true }
                )
                .setColor('RED');
            if(embed.fields[2].value) reportEmbed.addFields({name: "メッセージ", value: `${embed.fields[2].value}`});
            if(embed.image) reportEmbed.setImage(embed.image.url);

            modal.member.guild.channels.fetch(reportCh)
                .then(channel => {
                    let content = ' '
                    if (reportRoleMention) content = `<@&${reportRole}>`
                    channel.send({content: content, embeds: [reportEmbed]})
                        .then(() => {
                            modal.update({content: "**報告ありがとうございます!** 通報をサーバー運営に送信しました!", embeds: [], components: [], ephemeral:true})
                        })
                        .catch(() => {
                            Configs.update({reportCh: null}, {where: {serverId: modal.guild.id}})
                            modal.update({content: "🛑 通報の送信中に問題が発生しました。", embeds: [], components: [], ephemeral:true})
                        })
                })
                .catch(() => {
                    Configs.update({reportCh: null}, {where: {serverId: modal.guild.id}});
                    modal.update({content: "🛑 通報の送信中に問題が発生しました。", embeds: [], components: [], ephemeral:true});
                })
        }

        if (modal.customId == 'modal-reportUser') {
            const config = await Configs.findOne({where: {serverId: modal.guild.id}});
            const reportRoleMention = config.get('reportRoleMention');
            const reportCh = config.get('reportCh');
            const reportRole = config.get('reportRole');
            
            const embed = modal.message.embeds[0];
            const reportedUser = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''))
            const reportUser = modal.user;
            const reportReason = modal.getTextInputValue('textinput');
            const reportEmbed = new discord.MessageEmbed()
                .setTitle('⚠ 通報 (メンバー)')
                .setDescription(`通報者: ${reportUser}\n` + discord.Formatters.codeBlock(`${reportReason}`))
                .setThumbnail(reportedUser.displayAvatarURL())
                .addFields(
                    {name: '対象者', value: `${reportedUser}`, inline:true}
                )
                .setColor('RED');

            modal.member.guild.channels.fetch(reportCh)
                .then(channel => {
                    let content = ' '
                    if (reportRoleMention) content = `<@&${reportRole}>`
                    channel.send({content: content, embeds: [reportEmbed]})
                        .then(() => {
                            modal.update({content: "**報告ありがとうございます!** 通報をサーバー運営に送信しました!", embeds: [], components: [], ephemeral:true})
                        })
                        .catch(() => {
                            Configs.update({reportCh: null}, {where: {serverId: modal.guild.id}})
                            modal.update({content: "🛑 通報の送信中に問題が発生しました。", embeds: [], components: [], ephemeral:true})
                        })
                })
                .catch(() => {
                    Configs.update({reportCh: null}, {where: {serverId: modal.guild.id}});
                    modal.update({content: "🛑 通報の送信中に問題が発生しました。", embeds: [], components: [], ephemeral:true});
                })
        }
    }
}