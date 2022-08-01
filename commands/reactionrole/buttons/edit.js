const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ButtonInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'reactionRole-Edit', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language) => {

        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];

        if (select.type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription(language('REACTION_DELETEROLE_ERROR'))
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        if (interaction.message.components[1].components[3].style == 'DANGER') {
            select.components[0].setMaxValues(select.components[0].options.length);
        }

        // eslint-disable-next-line no-empty-function
        const panel = await interaction.channel.messages.fetch(embed.author.name).catch(() => {});
        const authorName = embed.author.name;
        embed.author = null;

        if (!panel) {
            return interaction.channel.send({
                embeds: [embed],
                components: [select],
            }).then(() => {
                const success = new discord.MessageEmbed()
                    .setDescription(language('REACTION_EDIT_SEND'))
                    .setColor('GREEN');
                interaction.update({ content: ' ', embeds: [success], components:[] });
            }).catch(() => {
                embed.setAuthor({
                    name: `${authorName}`,
                    iconURL: 'https://media.discordapp.net/attachments/958791423161954445/1003671818881740891/988439788132646954.png',
                });
                const error = new discord.MessageEmbed()
                    .setDescription(language('REACTION_SEND_ERROR'))
                    .setColor('RED');
                interaction.update({ embeds: [embed, error] });
            });
        }

        panel.edit({
            embeds: [embed],
            components: [select],
        }).then(() => {
            const success = new discord.MessageEmbed()
                .setDescription(language('REACTION_EDIT_SUCCESS'))
                .setColor('GREEN');
            interaction.update({ content: ' ', embeds: [success], components:[] });
        }).catch(() => {
            embed.setAuthor({
                name: `${authorName}`,
                iconURL: 'https://media.discordapp.net/attachments/958791423161954445/1003671818881740891/988439788132646954.png',
            });
            const error = new discord.MessageEmbed()
                .setDescription(language('REACTION_SEND_ERROR'))
                .setColor('RED');
            interaction.update({ embeds: [embed, error] });
        });
    },
};