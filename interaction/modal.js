const setting_module = require('../modules/setting');
const { Formatters } = require('discord.js');

module.exports = {
    async execute(modal) {
        if (modal.customId == 'modal_setting1-2') {
            await modal.deferReply({ephemeral: true});
            const string = modal.getTextInputValue('textinput');
            try {
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id;
                setting_module.change_setting("welcomeCh", messageId);
                modal.followUp({ content: `入退室ログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
            } catch (error) {
                modal.followUp({ content: `**入力した名前のチャンネルが見つかりません!**\n正しいIDにしているか、BOTが見れるチャンネルに設定しているかチェックしてください!`, ephemeral: true });
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
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id;
                setting_module.change_setting("timeoutLogCh", messageId);
                modal.followUp({ content: `タイムアウトログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
            } catch (error) {
                modal.followUp({ content: `**入力した名前のチャンネルが見つかりません!**\n正しいIDにしているか、BOTが見れるチャンネルに設定しているかチェックしてください!`, ephemeral: true });
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
                const messageId = modal.guild.channels.cache.find((channel) => channel.name === string).id;
                
                setting_module.change_setting("banidLogCh", messageId);
                modal.followUp({ content: `BANIDログを送るチャンネルを<#${messageId}>に設定しました。`, ephemeral: true });
            } catch (error) {
                modal.followUp({ content: `**入力した名前のチャンネルが見つかりません!**\n正しいIDにしているか、BOTが見れるチャンネルに設定しているかチェックしてください!`, ephemeral: true });
            }
        }
    }
}