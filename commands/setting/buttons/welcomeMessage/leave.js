// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../../modules/switcher');
const { welcomeM_preview } = require('../../../../modules/messageSyntax');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-leave',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const Model = await require('../../../../models/welcomeM')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
        const { leave, leaveCh, leaveMessage } = Model.get();

        const embed = interaction.message.embeds[0];
        const button = interaction.message.components[1];

        let err = false;
        Model.update({ leave: leave ? false : true }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        embed.fields[1].value = settingSwitcher('STATUS_CH', !leave, leaveCh) + `\n\n${discord.formatEmoji('966596708458983484')} ${welcomeM_preview(leaveMessage)}`;
        button.components[1] = discord.ButtonBuilder.from(button.components[1])
            .setLabel(settingSwitcher('BUTTON_LABEL', !leave))
            .setStyle(settingSwitcher('BUTTON_STYLE', !leave)),

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
    },
};
module.exports = [ ping_command ];