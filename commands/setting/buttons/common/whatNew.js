const discord = require('discord.js');
const Octokit = require('@octokit/rest');
const octokit = new Octokit.Octokit();
const { beta } = require('../../../../config.json');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-whatsNew',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        await interaction.deferUpdate({ ephemeral: true });

        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
            .setCustomId('setting-back')
            .setEmoji('971389898076598322')
            .setStyle(discord.ButtonStyle.Primary),
        );

        if (beta.betaMode) {
            const embed = new discord.EmbedBuilder()
                .setTitle('📢 What\'s New')
                .setDescription([
                    `**${interaction.client.user.username}**`,
                    'このBOTはベータ版です。新機能や修正に関する最新情報は[こちら](https://ptb.discord.com/channels/949877204601405482/989556230756393041)でご確認ください。',
                ].join('\n'));

            return interaction.update({ embeds: [embed], components: [button] });
        }

        octokit.repos.listReleases({ owner: 'nonick-mc', repo: 'DiscordBot-NoNick.js' })
            .then((res) => {
                const whatsnew = res.data.find(v => v.prerelease == false);

                const embed = new discord.EmbedBuilder()
                    .setTitle('📢 What\'s New')
                    .setDescription(`**${interaction.client.user.username} ${whatsnew.name}**\n${whatsnew.body}`)
                    .setColor('Green');

                interaction.editReply({ embeds: [embed], components:[button], ephemeral: true });
            })
            .catch((e) => {
                const embed = new discord.EmbedBuilder()
                    .setDescription([
                        '⚠️ データの取得に失敗しました。しばらく待ってから再度お試しください。',
                        `**エラーコード:** \`\`\`${e}\`\`\``,
                    ].join('\n'))
                    .setColor('Red');

                interaction.editReply({ embeds: [embed], components: [button], ephemeral: true });
            });
    },
};
module.exports = [ ping_command ];