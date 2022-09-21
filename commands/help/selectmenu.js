// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'help-commandsList',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const commandDescriptionTemplate = '**[]**は必須、**()**は省略可能な引数です。(構文を忘れても大丈夫！スラッシュコマンドでは引数を補完することができます。)';
        const options = interaction.component.options.map(v => ({ label: v.label, value: v.value, emoji: v.emoji, default: v.value == interaction.values[0] ? true : false }));
        const select = new discord.ActionRowBuilder().addComponents(discord.SelectMenuBuilder.from(interaction.component).setOptions(options));

        const beta = discord.formatEmoji('1021382601031823371') + discord.formatEmoji('1021383211147870280');

        switch (interaction.values[0]) {
            case 'all': {
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

                interaction.update({ embeds: [embed], components: [select] });
                break;
            }
            case 'basic': {
                const embed = new discord.EmbedBuilder()
                    .setTitle(`**${interaction.client.user.username}** コマンド一覧`)
                    .setDescription(commandDescriptionTemplate)
                    .setColor(interaction.message.embeds[0].color)
                    .setFields(
                        { name: '/embed create [title] (description) (color) (attachment)',
                        value: '> `埋め込みを作成します。` [詳細](https://docs.nonick-js.com/features/embed/)' },
                        { name: '/embed import [json]',
                        value: '> `jsonファイルから埋め込みを作成します。` [詳細](https://docs.nonick-js.com/features/embed/#インポート)' },
                        { name: '/reactionrole [title] (description) (color) (attachment)',
                        value: '> `リアクションロールパネルを作成します。` [詳細](https://docs.nonick-js.com/features/reactionrole/)' },
                        { name: `/ticket ${beta}`,
                        value: '> `チケット作成パネルを作成します。`' },
                    );

                interaction.update({ embeds: [embed], components: [select] });
                break;
            }
            case 'moderate': {
                const embed = new discord.EmbedBuilder()
                    .setTitle(`**${interaction.client.user.username}** コマンド一覧`)
                    .setDescription(commandDescriptionTemplate)
                    .setColor(interaction.message.embeds[0].color)
                    .setFields(
                        { name: '/timeout [user] [day] [hour] [minute] (reason)',
                        value: '> `指定したメンバーを最大で28日タイムアウトします。` [詳細](https://docs.nonick-js.com/features/timeout/)' },
                        { name: '/setting',
                        value: `> \`${interaction.client.user.username}のコントロールパネルを開きます。\` [詳細](https://docs.nonick-js.com/features/setting/)` },
                    );

                interaction.update({ embeds: [embed], components: [select] });
                break;
            }
            case 'info': {
                const embed = new discord.EmbedBuilder()
                    .setTitle(`**${interaction.client.user.username}** コマンド一覧`)
                    .setDescription(commandDescriptionTemplate)
                    .setColor(interaction.message.embeds[0].color)
                    .setFields(
                        { name: `/help ${beta}`,
                        value: '> `このコマンドです。`' },
                        { name: '/info',
                        value: `> \`${interaction.client.user.username}に関する情報を表示します。\` [詳細](https://docs.nonick-js.com/features/info/)` },
                        { name: `/status ${beta}`,
                        value: `> \`${interaction.client.user.username}のBOTステータスを表示します。\`` },
                    );

                interaction.update({ embeds: [embed], components: [select] });
            break;
            }
        }
    },
};
module.exports = [ ping_command ];