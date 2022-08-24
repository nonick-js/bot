const discord = require('discord.js');
const swicher = require('../../../modules/swicher');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.SelectMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-select', type: 'SELECT_MENU' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const button = new discord.MessageActionRow().addComponents(
            new discord.MessageButton()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle('PRIMARY'),
        );

        if (interaction.values == 'setting-welcomemessage') {
            const { welcome, welcomeCh, welcomeMessage, leave, leaveCh } = config.get();

            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - 入退室ログ')
                .setDescription('```サーバーに新しくメンバーが参加した時や退室した時に通知してくれる機能です。メッセージを設定することで参加した人に見てもらいたい情報を送信できます。```\n**【現在の設定】**')
                .setColor('GREEN')
                .addFields(
                    { name: '入室ログ', value: swicher.chStatusSwicher(welcome, welcomeCh), inline:true },
                    { name: '退室ログ', value: swicher.chStatusSwicher(leave, leaveCh), inline:true },
                    { name: '入室ログメッセージ', value: welcomeMessage || '__設定されていません(how)__' },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('welcomeSetting')
                    .addOptions([
                        { label: '入室ログ', value: 'setting-welcome-1', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624', default: true },
                        { label: '退室ログ', value: 'setting-welcome-2', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624' },
                    ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-welcome')
                    .setLabel(swicher.buttonLabelSwicher(welcome))
                    .setStyle(swicher.buttonStyleSwicher(welcome))
                    .setDisabled(swicher.buttonDisableSwicher(welcomeCh)),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeCh')
                    .setLabel('送信先')
                    .setEmoji('966588719635267624')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('setting-welcomeMessage')
                    .setLabel('メッセージ')
                    .setEmoji('966596708458983484')
                    .setStyle('SECONDARY'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-report') {
            const { reportCh, reportRoleMention, reportRole } = config.get();

            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - 通報機能')
                .setDescription('**Tips**: コンテキストメニュー自体の機能をOFFにしたい場合は、`サーバー設定→連携サービス→NoNICK.js`から変更できます。```メンバーがサーバールール等に違反しているメッセージを通報できる機能です。モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。```\n**【現在の設定】**')
                .setColor('GREEN')
                .addFields(
                    { name: '通報の送信先', value: reportCh ? `<#${reportCh}>` : `${'__設定されていません__'}`, inline: true },
                    { name: 'ロールメンション', value: swicher.roleStatusSwicher(reportRoleMention, reportRole), inline: true },
                );
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                .setCustomId('reportSetting')
                .addOptions([
                    { label: '全般設定', value: 'setting-report-1', emoji: '🌐', default: true },
                    { label: 'ロールメンション機能', description: '通報受け取り時にロールをメンション', value: 'setting-report-2', emoji: '966719258430160986' },
                ]),
            ]);
            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-reportCh')
                    .setLabel('送信先')
                    .setStyle('SECONDARY')
                    .setEmoji('966588719635267624'),
            ]);
            interaction.update({ embeds: [embed], components: [select, button] });
        }

        if (interaction.values == 'setting-linkOpen') {
            const linkOpen = config.get('linkOpen');

            const embed = new discord.MessageEmbed()
                .setTitle('🛠 設定 - リンク展開')
                .setDescription([
                    '```Discordのメッセージリンクを送信した際にリンク先のメッセージを表示してくれる機能です。',
                    '流れてしまったメッセージや過去のメッセージをチャットに出したい時に便利です。```\n**【現在の設定】**',
                ].join('\n'))
                .setColor('GREEN')
                .addFields({ name: 'リンク展開', value: swicher.statusSwicher(linkOpen), inline: true });
            const select = new discord.MessageActionRow().addComponents([
                new discord.MessageSelectMenu()
                    .setCustomId('linkOpenSetting')
                    .addOptions({ label: '全般設定', value: 'setting-linkOpen-1', emoji: '966588719635267624', default:true }),
            ]);

            button.addComponents([
                new discord.MessageButton()
                    .setCustomId('setting-linkOpen')
                    .setLabel(swicher.buttonLabelSwicher(linkOpen))
                    .setStyle(swicher.buttonStyleSwicher(linkOpen)),
            ]);
            interaction.update({ embeds: [embed], components: [select, button], ephemeral:true });
        }
    },
};