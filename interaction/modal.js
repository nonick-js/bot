const setting_module = require('../modules/setting');
const { Formatters, MessageEmbed } = require('discord.js');

module.exports = {
    async execute(modal,client) {
        const embed_MissingPermission = new MessageEmbed()
            .setDescription(`**BOTの権限が不足しています!**\n送信先に指定しようとしているチャンネルの「チャンネルを見る」「メッセージを送信」「埋め込みリンク」権限をBOTに付与してください。`)
            .setColor('RED');
        const embed_channelNotFound = new MessageEmbed()
            .setDescription('**チャンネルが存在しません!**\n正しいチャンネル名を入力してください。')
            .setColor('RED');

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
    }
}