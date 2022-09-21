// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ChatInputRegister} */
const ping_command = {
    data: {
        name: 'help',
        description: 'このBOTのスラッシュコマンド一覧を表示します',
        dmPermission: true,
        type: 'CHAT_INPUT',
    },
    exec: async (interaction) => {
        const basicCommands = [
            '/embed create',
            '/embed import',
            '/reactionrole',
            '/ticket',
        ];
        const moderateCommands = [
            '/timeout',
            '/setting',
        ];
        const infoCommands = [
            '/help',
            '/info',
            '/status',
        ];

        const embed = new discord.EmbedBuilder()
            .setTitle(`${interaction.client.user.username} コマンド一覧`)
            .setDescription([
                `> **${interaction.client.user.username}**のコマンドは全て**スラッシュコマンド**です。`,
                '> セレクトメニューからカテゴリを選択し、各コマンドの[詳細](https://docs.nonick-js.com)をクリックすると、対応したドキュメントに移動します。',
            ].join('\n'))
            .setColor('526ff5')
            .setFields(
                { name: '一般コマンド', value: basicCommands.map(v => `\`${v}\``).join(' ') },
                { name: 'モデレート・設定コマンド', value: moderateCommands.map(v => `\`${v}\``).join(' ') },
                { name: '情報コマンド', value: infoCommands.map(v => `\`${v}\``).join(' ') },
            );

        const select = new discord.ActionRowBuilder().addComponents(
            new discord.SelectMenuBuilder()
                .setCustomId('help-commandsList')
                .setOptions(
                    { label: '全てのコマンド', value: 'all', emoji: '1011504807644758137', default: true },
                    { label: '一般コマンド', value: 'basic', emoji: '988439798324817930' },
                    { label: 'モデレート・設定コマンド', value: 'moderate', emoji: '969148338597412884' },
                    { label: '情報コマンド', value: 'info', emoji: '971068579002851398' },
                ),
        );

        interaction.reply({ embeds: [embed], components: [select], ephemeral: true });
    },
};
module.exports = [ ping_command ];