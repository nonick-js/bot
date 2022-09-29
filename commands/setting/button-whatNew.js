const discord = require('discord.js');
const Octokit = require('@octokit/rest');
const octokit = new Octokit.Octokit();

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
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

    octokit.repos.listReleases({ owner: 'nonick-mc', repo: 'DiscordBot-NoNick.js' })
      .then((res) => {
        const whatsNew = res.data.find(v => v.prerelease == false);

        const embed = new discord.EmbedBuilder()
          .setTitle('📢 What\'s New')
          .setDescription(`**${interaction.client.user.username} ${whatsNew.name}**\n${whatsNew.body}`)
          .setColor('Green');

        interaction.editReply({ embeds: [embed], components:[button] });
      })
      .catch((e) => {
        const embed = new discord.EmbedBuilder()
          .setDescription([
            '⚠️ データの取得に失敗しました。しばらく待ってから再度お試しください。',
            `\`\`\`${e}\`\`\``,
          ].join('\n'))
          .setColor('Red');

					interaction.editReply({ embeds: [embed], components: [button] });
      });
    },
};
module.exports = [ buttonInteraction ];