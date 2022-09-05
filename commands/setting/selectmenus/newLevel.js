// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'setting-newLevel',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        const Model = await require('../../../models/verification')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

        const embed = interaction.message.embeds[0];
        const select = interaction.message.components[1];

        const levelStatus = [
            '🟢 **低** `メール認証がされているアカウントのみ`',
            '🟡 **中** `Discordに登録してから5分以上経過したアカウントのみ`',
            '🟠 **高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`',
            '🔴 **最高** `電話認証がされているアカウントのみ`',
        ];

        select.components[0] = discord.SelectMenuBuilder.from(select.components[0])
            .setOptions(
                { label: '低', description: 'メール認証がされているアカウントのみ', value: '1', emoji: '🟢', default: Number(interaction.values) == 1 },
                { label: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ', value: '2', emoji: '🟡', default: Number(interaction.values) == 2 },
                { label: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ', value: '3', emoji: '🟠', default: Number(interaction.values) == 3 },
                { label: '最高', description: '電話認証がされているアカウントのみ', value: '4', emoji: '🔴', default: Number(interaction.values) == 4 },
            );

        let err = false;
        Model.update({ newLevel: Number(interaction.values) }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        embed.fields[2].value = levelStatus[Number(interaction.values) - 1];

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], select, interaction.message.components[2]] });
    },
};
module.exports = [ ping_command ];