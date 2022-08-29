const discord = require('discord.js');
const Octokit = require('@octokit/rest');
const octokit = new Octokit.Octokit();

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-whatsNew',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        await interaction.deferUpdate({ ephemeral: true });
        octokit.repos.listReleases({ owner: 'nonick-mc', repo: 'DiscordBot-NoNick.js' })
            .then((res) => {
                const whatsnew = res.data.find(v => v.prerelease == false);

                const embed = new discord.EmbedBuilder()
                    .setTitle('📢 What\'s New')
                    .setDescription(`**${interaction.client.user.username} ${whatsnew.name}\`\`\`md\n${whatsnew.body}\`\`\`**`)
                    .setColor('Green');
                const button = new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle(discord.ButtonStyle.Primary),
                );

                interaction.editReply({ embeds: [embed], components:[button], ephemeral: true });
            })
            .catch((e) => {
                const embed = new discord.EmbedBuilder()
                    .setDescription([
                        '⚠️ データの取得に失敗しました。',
                        'しばらく待ってから再度お試しください。',
                        `**エラーコード:** \`\`\`${e}\`\`\``,
                    ].join('\n'))
                    .setColor('Red');
                const button = new discord.ActionRowBuilder().addComponents(
                    new discord.ButtonBuilder()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle(discord.ButtonStyle.Primary),
                );

                interaction.editReply({ embeds: [embed], components: [button], ephemeral: true });
            });
    },
};
module.exports = [ ping_command ];