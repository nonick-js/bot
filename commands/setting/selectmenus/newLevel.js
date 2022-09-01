// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const ping_command = {
    data: {
        customId: 'setting-newLevel',
        type: 'SELECT_MENU',
    },
    exec: async (interaction) => {
        /** @type {discord.Embed} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const levelSelect = interaction.message.components[1];

        interaction.db_verificationConfig.update({ newLevel: Number(interaction.values) }, { where: { serverId: interaction.guildId } });
        const verificationConfig = await interaction.db_verificationConfig.findOne({ where: { serverId: interaction.guildId } });
        const { newLevel } = verificationConfig.get();

        const levelStatus = [
            '🟢**低** `メール認証がされているアカウントのみ`',
            '🟡**中** `Discordに登録してから5分以上経過したアカウントのみ`',
            '🟠**高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`',
            '🔴**最高** `電話認証がされているアカウントのみ`',
        ];

        levelSelect.components[0] = discord.SelectMenuBuilder.from(levelSelect.components[0])
            .setOptions(
                { label: '低', description: 'メール認証がされているアカウントのみ', value: '1', emoji: '🟢', default: newLevel == 1 },
                { label: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ', value: '2', emoji: '🟡', default: newLevel == 2 },
                { label: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ', value: '3', emoji: '🟠', default: newLevel == 3 },
                { label: '最高', description: '電話認証がされているアカウントのみ', value: '4', emoji: '🔴', default: newLevel == 4 },
            ),

        embed.fields[2].value = levelStatus[Number(interaction.values) - 1];

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], levelSelect, interaction.message.components[2]] });
    },
};
module.exports = [ ping_command ];