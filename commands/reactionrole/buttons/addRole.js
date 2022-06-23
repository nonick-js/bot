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
    data: { customid: 'reactionRole-AddRole', type: 'BUTTON' },
    /** @type {InteractionCallback} */
    exec: async (interaction) => {
        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[0].components[0];

        if (select.type == 'SELECT_MENU' && select.options.length == 25) {
            const error = new discord.MessageEmbed()
                .setDescription('❌ これ以上ロールを追加できません!')
                .setColor('RED');
            return interaction.update({ embeds: [embed, error] });
        }

        const modal = new discord.Modal()
            .setCustomId('reactionRole-addRole')
            .setTitle('ロールを追加')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput')
                        .setLabel('パネルに追加したいロールの名前')
                        .setStyle('SHORT')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput1')
                        .setLabel('表示名')
                        .setStyle('SHORT')
                        .setMaxLength(100)
                        .setRequired(true),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput2')
                        .setLabel('説明')
                        .setStyle('SHORT')
                        .setMaxLength(100),
                ),
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId('textinput3')
                        .setLabel('カスタム絵文字')
                        .setStyle('SHORT')
                        .setPlaceholder('絵文字名で入力してください')
                        .setMaxLength(32),
                ),
            );
        interaction.showModal(modal);
    },
};