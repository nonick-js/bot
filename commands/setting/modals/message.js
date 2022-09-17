// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../modules/switcher');
const syntax = require('../../../modules/messageSyntax');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-Message',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;
        const embed = interaction.message.embeds[0];

        const settingData = [
            { key: 'welcomeMessage', model: 'welcomeM', embedIndex: 0, enable: 'welcome', channel: 'welcomeCh', syntax: 'welcomeM_preview' },
            { key: 'leaveMessage', model: 'welcomeM', embedIndex: 1, enable: 'welcome', channel: 'welcomeCh', syntax: 'welcomeM_preview' },
        ];
        const setting = settingData.find(v => v.key == customId);

        const Model = await require(`../../../models/${setting.model}`)(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

        let err = false;
        Model.update({ [setting.key]: value }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        if (setting.enable && setting.channel) embed.fields[setting.embedIndex].value = settingSwitcher('STATUS_CH', Model.get(setting.enable), Model.get(setting.channel)) + `\n\n${discord.formatEmoji('966596708458983484')} ${syntax[setting.syntax](value)}`;
        else embed.fields[setting.embedIndex].value = value;

        interaction.update({ embeds: [embed] });
    },
};
module.exports = [ ping_command ];