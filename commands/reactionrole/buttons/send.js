const discord = require('discord.js');

/**
* @callback InteractionCallback
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
    data: { customid: 'reactionRole-Send', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0];
        if (select.components[0].type == 'BUTTON') {
            const error = new discord.MessageEmbed()
                .setDescription('❌ パネルには最低でも**1つ**ロールを追加する必要があります!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        if (interaction.message.components[1].components[3].label == '複数選択') select.components[0].setMaxValues(select.components[0].options.length);
        interaction.channel.send({ embeds: [embed], components: [select] })
            .then(() => {
                const success = new discord.MessageEmbed()
                    .setDescription('✅ パネルを作成しました!')
                    .setColor('GREEN');
                interaction.update({ content: ' ', embeds: [success], components:[] });
            })
            .catch(() => {
                const error = new discord.MessageEmbed()
                    .setDescription('❌ このチャンネルに送信する権限がありません!')
                    .setColor('RED');
                interaction.update({ embeds: [embed, error] });
            });
    },
};