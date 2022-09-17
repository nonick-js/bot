// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../modules/switcher');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-Role',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;
        const embed = interaction.message.embeds[0];
        const button = interaction.message.components[1];

        const settingData = [
            { key: 'reportRole', model: 'basic', embedIndex: 1, enableButtonModel: 'reportRoleMention' },
        ];
        const setting = settingData.find(v => v.key == customId);
        const role = interaction.guild.roles.cache.find(v => v.name == value);

        if (!role) {
            const roleNotFound = new discord.EmbedBuilder()
                .setDescription(`⚠️ ${discord.inlineCode(value)}という名前のロールは存在しません！`)
                .setColor('Red');
            return interaction.update({ embeds: [embed, roleNotFound] });
        }

        const Model = await require(`../../../models/${setting.model}`)(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

        let err = false;
        Model.update({ [setting.key]: role.id }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        embed.fields[setting.embedIndex].value = settingSwitcher('STATUS_ROLE', Model.get(setting.enableButtonModel), role.id);
        button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(false);

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
    },
};
module.exports = [ ping_command ];