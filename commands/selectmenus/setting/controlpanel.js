const fs = require('fs');
const discord = require('discord.js');
const templatebutton = new discord.MessageActionRow().addComponents([
    new discord.MessageButton()
        .setCustomId('setting-control-back')
        .setEmoji('971389898076598322')
        .setStyle('PRIMARY'),
    new discord.MessageButton()
        .setCustomId('setting-control-reset')
        .setLabel('初期化')
        .setStyle('DANGER')
])

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {customid: 'setting-control-select', type: 'SELECT_MENU'},
    /**@type {InteractionCallback} */
    exec: async (interaction) => {
        if (interaction.values == 'setting-control-welcomemessage') {
            const { welcome, welcomeCh, welcomeMessage } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - 入退室ログ')
                .setDescription('入退室ログの設定を以下のセレクトメニューから行えます。\n設定を初期状態に戻したり、機能のON/OFFを切り替えたい場合は下のボタンを押そう!' + discord.Formatters.codeBlock('markdown','#入退室ログとは...\nサーバーに新しくメンバーが参加した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。'))
                .setColor('#57f287');
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                .setCustomId('setting-control-welcome-enable')
                .setLabel('ON')
                .setStyle('SUCCESS'),
                new discord.MessageButton()
                .setCustomId('setting-control-welcome-sendch')
                .setLabel('送信先')
                .setEmoji('966588719635267624')
                .setStyle('SECONDARY'),
                new discord.MessageButton()
                .setCustomId('setting-control-welcome-message')
                .setLabel('メッセージ')
                .setEmoji('966596708458983484')
                .setStyle('SECONDARY')
            ]);

            if (!welcome) {
                button.components[0].setStyle('DANGER');
                button.components[0].setLabel('OFF')
            }
            if (welcomeCh == null) button.components[0].setDisabled(true);
            interaction.update({embeds: [embed], components: [button, templatebutton], ephemeral:true});
        }

        if (interaction.values == 'setting-control-report') {   
            const { reportCh, reportRoleMention, reportRole } = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - 通報機能')
                .setDescription('通報機能の設定を以下のセレクトメニューから行えます。' + discord.Formatters.codeBlock('markdown', '#通報機能とは...\nメンバーがサーバールール等に違反しているメッセージを通報できる機能です。モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。\n'))
                .setColor('GREEN');

            if (reportCh) {
                embed.addFields({name: "通報の送信先" , value: `<#${reportCh}>`, inline: true})
            } else {
                embed.addFields({name: "通報の送信先" , value: `**指定されていません**`, inline: true})
            }

            if (reportRoleMention) {
                embed.addFields({name: "ロールメンション" , value: discord.Formatters.formatEmoji('758380151544217670') +` (<@&${reportRole}>)`, inline: true});
            } else {
                embed.addFields({name: "ロールメンション" , value: discord.Formatters.formatEmoji('758380151238033419'), inline: true});
            }

            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .setPlaceholder('ここから選択')
                .addOptions([
                    { label: 'レポートを受け取るチャンネルの変更', description: '運営のみ見れるチャンネルを選択しよう!' , value: 'reportSetting1', emoji: '966588719635267624' },
                    { label: 'メンションするロールの変更', description: 'このロールがメンションされます。', value: 'reportSetting2', emoji: '966588719635263539' },
                ]),
            ])
            const button = new discord.MessageActionRow().addComponents([
                new discord.MessageButton()
                .setCustomId('setting-control-back')
                .setEmoji('971389898076598322')
                .setStyle('PRIMARY'),
                // new discord.MessageButton()
                // .setCustomId('reportSetting-mentionEnable')
                // .setLabel('メンション')
                // .setStyle('SECONDARY'),
                new discord.MessageButton()
                .setCustomId('reportSetting-restore')
                .setLabel('初期化')
                .setStyle('DANGER'),
            ]);
            interaction.update({embeds: [embed], components: [select, button], ephemeral:true});
        }
    }
}