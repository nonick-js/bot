const fs = require('fs');
const setting_module = require('../modules/setting');
const { Formatters, MessageEmbed, Message } = require('discord.js');
const embed_MissingPermission = new MessageEmbed()
    .setDescription(`**BOTの権限が不足しています!**\n送信先に指定しようとしているチャンネルの「チャンネルを見る」「メッセージを送信」「埋め込みリンク」権限をBOTに付与してください。`)
    .setColor('RED');
const embed_channelNotFound = new MessageEmbed()
    .setDescription('**チャンネルが存在しません!**\n正しいチャンネル名を入力してください。')
    .setColor('RED');

module.exports = {
    async execute(modal,client) {

        if (modal.customId == 'modal_setting1-2') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
                const embed = new MessageEmbed()
                    .setDescription('✅ 入退室ログがここに送信されます!')
                    .setColor('GREEN');
                client.channels.cache.get(messageId).send({embeds: [embed]})
                    .then(() => {
                        setting_module.change_setting("welcomeCh", messageId);
                        modal.followUp({ content: `入退室ログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
                    })
                    .catch(() => {
                        modal.followUp({ embeds: [embed_MissingPermission], ephemeral: true });
                    })
            }
            catch {
                modal.followUp({ embeds: [embed_channelNotFound], ephemeral: true });
            }
        }
        
        if (modal.customId == 'modal_setting1-3') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            setting_module.change_setting("welcomeMessage", string);
            modal.followUp({content: 'メッセージを以下の通りに編集しました。' + Formatters.codeBlock('markdown', string), ephemeral: true});
        }
        
        if (modal.customId == 'timeoutModal1') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
                const embed = new MessageEmbed()
                    .setDescription('✅ タイムアウトログがここに送信されます!')
                    .setColor('GREEN');
                client.channels.cache.get(messageId).send({embeds: [embed]})
                    .then(() => {
                        setting_module.change_setting("timeoutLogCh", messageId);
                        modal.followUp({ content: `タイムアウトログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
                    })
                    .catch(() => {
                        modal.followUp({ embeds: [embed_MissingPermission], ephemeral: true });
                    })
            }
            catch {
                modal.followUp({ embeds: [embed_channelNotFound], ephemeral: true });
            }
        }
        
        if (modal.customId == 'timeoutModal2') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            setting_module.change_setting("timeoutDmString", string);
            modal.followUp({content: 'メッセージを以下の通りに編集しました。' + Formatters.codeBlock('markdown', string), ephemeral: true});
        }

        if (modal.customId == 'banidModal1') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
                const embed = new MessageEmbed()
                    .setDescription('✅ BANIDログがここに送信されます!')
                    .setColor('GREEN');
                client.channels.cache.get(messageId).send({embeds: [embed]})
                    .then(() => {
                        setting_module.change_setting("banidLogCh", messageId);
                        modal.followUp({ content: `BANIDログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
                    })
                    .catch(() => {
                        modal.followUp({ embeds: [embed_MissingPermission], ephemeral: true });
                    })
            }
            catch {
                modal.followUp({ embeds: [embed_channelNotFound], ephemeral: true });
            }
        }

        if (modal.customId == 'reportModal1') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
                const embed = new MessageEmbed()
                    .setDescription('✅ 送信された通報がここに受信されます!')
                    .setColor('GREEN');
                client.channels.cache.get(messageId).send({embeds: [embed]})
                    .then(() => {
                        setting_module.change_setting("banidLogCh", messageId);
                        modal.followUp({ content: `通報を受け取るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
                    })
                    .catch(() => {
                        modal.followUp({ embeds: [embed_MissingPermission], ephemeral: true });
                    })
            }
            catch {
                modal.followUp({ embeds: [embed_channelNotFound], ephemeral: true });
            }
        }

        // if (modal.customId == 'reportModal2') {
        //     await modal.deferReply({ephemeral: true});
        //     const string = modal.getTextInputValue('textinput');
        //     try {
        //         const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id  
        //         const embed = new MessageEmbed()
        //             .setDescription('✅ 送信された通報がここに受信されます!')
        //             .setColor('GREEN');
        //         client.channels.cache.get(messageId).send({embeds: [embed]})
        //             .then(() => {
        //                 setting_module.change_setting("banidLogCh", messageId);
        //                 modal.followUp({ content: `通報を受け取るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
        //             })
        //             .catch(() => {
        //                 modal.followUp({ embeds: [embed_MissingPermission], ephemeral: true });
        //             })
        //     }
        //     catch {
        //         const embed = new MessageEmbed()
        //             .setDescription('指定されたロールが見つかりませんでした。正しい名前を入力してください。')
        //         modal.followUp();
        //     }
        // }

    // reportコンテキストメニュー
        if (modal.customId == 'reportModal') {
            await modal.deferReply({ephemeral: true});

            const embed = modal.message.embeds?.[0];
            const embedfield = modal.message.embeds?.[0]?.fields;
            const reportedMessageAuthor = await client.users.fetch(embedfield[0].value.replace(/^../g, '').replace(/.$/, ''))
			const reportedMessageCh = embedfield[1].value;

            const reportUser = modal.user;
            const reportReason = modal.getTextInputValue('textinput');
            console.log(reportedMessageAuthor.avatarURL())

            const reportEmbed = new MessageEmbed()
                .setTitle('⚠ 通報')
                .setDescription(`通報者: ${reportUser}\n` + Formatters.codeBlock(`通報理由: ` + `${reportReason}`))
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

            const { reportCh } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
            client.channels.cache.get(reportCh).send({embeds: [reportEmbed]});
            modal.followUp({content: "**報告ありがとうございます!** 通報をサーバー運営に送信しました!", ephemeral:true});
        }
    }
}