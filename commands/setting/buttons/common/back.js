const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-back',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const embed = new discord.EmbedBuilder()
            .setTitle(`🛠 ${interaction.client.user.username} - 設定`)
            .setDescription([
                `${interaction.client.user.username}のコントロールパネルへようこそ!`,
                'ここではこのBOTの設定を変更することができます!',
                '```セレクトメニューから閲覧・変更したい設定を選択しよう!```',
            ].join('\n'))
            .setColor('Green');
        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('setting-whatsNew')
                .setLabel('What\'s New')
                .setEmoji('966588719643631666')
                .setStyle(discord.ButtonStyle.Primary),
        );
        const select = new discord.ActionRowBuilder().addComponents(
            new discord.SelectMenuBuilder()
                .setCustomId('setting-categorySelect')
                .addOptions([
                    { label: '入退室ログ機能', value: 'setting-welcomeMessage', emoji: '🚪' },
                    { label: '通報機能', value: 'setting-report', emoji: '📢' },
                    { label: 'リンク展開機能', value: 'setting-linkOpen', emoji: '🔗' },
                    { label: 'ログ機能', value: 'setting-log', emoji: '📑' },
                    { label: '認証レベル自動変更機能', value: 'setting-verification', emoji: '✅' },
                ]),
        );

        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];