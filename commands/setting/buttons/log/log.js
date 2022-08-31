// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwicher } = require('../../../../modules/swicher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-log',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const { log, logCh } = config.get();

        /** @type {discord.Embed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        interaction.db_config.update({ log: log ? false : true }, { where: { serverId: interaction.guildId } });

        embed.fields[0].value = settingSwicher('STATUS_CH', !log, logCh);
        button.components[1] = discord.ButtonBuilder.from(button.components[1])
            .setLabel(settingSwicher('BUTTON_LABEL', !log))
            .setStyle(settingSwicher('BUTTON_STYLE', !log)),

        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];