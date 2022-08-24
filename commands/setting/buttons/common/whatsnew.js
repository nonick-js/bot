const discord = require('discord.js');
const Octokit = require('@octokit/rest');
const octokit = new Octokit.Octokit();

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ButtonInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'setting-whatsnew', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {

        octokit.repos.listReleases({ owner: 'nonick-mc', repo: 'DiscordBot-NoNick.js' })
            .then((res) => {
                const whatsnew = res.data.find(v => v.prerelease == false);

                const embed = new discord.MessageEmbed()
                    .setTitle('📢 What\'s New')
                    .setDescription(`**${client.user.username} ${whatsnew.name}\`\`\`md\n${whatsnew.body}\`\`\`**`)
                    .setColor('GREEN');
                const button = new discord.MessageActionRow().addComponents(
                    new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                );

                interaction.update({ embeds: [embed], components:[button], ephemeral: true });
            })
            .catch(() => {
                const embed = new discord.MessageEmbed()
                    .setDescription('⚠️ データの取得に失敗しました。\nしばらく待ってから再度お試しください。')
                    .setColor('RED');
                const button = new discord.MessageActionRow().addComponents(
                    new discord.MessageButton()
                    .setCustomId('setting-back')
                    .setEmoji('971389898076598322')
                    .setStyle('PRIMARY'),
                );

                interaction.update({ embeds: [embed], components: [button], ephemeral: true });
            });
    },
};