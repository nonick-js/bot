// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwicher } = require('../../../../modules/swicher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-reportRoleMention',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const { reportRole, reportRoleMention } = config.get();

        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        interaction.db_config.update({ reportRoleMention: reportRoleMention ? false : true }, { where: { serverId: interaction.guildId } });
        embed.fields[1].value = settingSwicher('STATUS_ROLE', !reportRoleMention, reportRole);
        button.components[1]
            .setLabel(settingSwicher('BUTTON_LABEL', !reportRoleMention))
            .setStyle(settingSwicher('BUTTON_STYLE', !reportRoleMention));

        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];