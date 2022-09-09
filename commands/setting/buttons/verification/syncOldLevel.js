// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const levelStatus = [
    '⚪ **無制限**',
    '🟢 **低** `メール認証がされているアカウントのみ`',
    '🟡 **中** `Discordに登録してから5分以上経過したアカウントのみ`',
    '🟠 **高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`',
    '🔴 **最高** `電話認証がされているアカウントのみ`',
];

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'sync-oldLevel',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const verificationModel = await require('../../../../models/verification')(interaction.sequelize).findOne({ where: { serverId: interaction.guild.id } });
        const { oldLevel } = verificationModel.get();

        if (oldLevel == interaction.guild.verificationLevel) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ その認証レベルはすでに同期されています！')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], embed] });
        }

        let err = false;

        verificationModel.update({ oldLevel: interaction.guild.verificationLevel }).catch(() => err = true);

        if (err) {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [interaction.message.embeds[0], embed] });
        }

        const embed = new discord.EmbedBuilder()
            .setDescription(`**自動変更が終わった後の認証レベルを同期しました！**\n${levelStatus[interaction.guild.verificationLevel]}`)
            .setColor('Green');
        return interaction.update({ embeds: [interaction.message.embeds[0], embed] });
    },
};
module.exports = [ ping_command ];