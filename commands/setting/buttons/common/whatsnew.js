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
    exec: async (client, interaction, Configs, laungage) => {
        octokit.repos.listReleases({ owner: 'nonick-mc', repo: 'DiscordBot-NoNick.js' })
            .then((res) => {
                const whatsnew = res.data.find(v => v.prerelease == false);
                const embed = new discord.MessageEmbed()
                    .setTitle('What\'s New')
                    .setDescription(`**${client.user.username} ${whatsnew.name}\`\`\`md\n${whatsnew.body}\`\`\`**`)
                    .setColor('BLUE');
                interaction.reply({ embeds: [embed], ephemeral: true });
            })
            .catch(() => {
                const embed = new discord.MessageEmbed()
                    .setDescription(laungage('SETTING_WHATSNEW_ERROR'))
                    .setColor('RED');
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
    },
};