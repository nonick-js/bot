// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const verificationStatusData = [
    { key: 0, name: '設定しない', description: '無制限' },
    { key: 1, name: '低', description: 'メール認証がされているアカウントのみ' },
    { key: 2, name: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ' },
    { key: 3, name: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ' },
    { key: 4, name: '最高', description: '電話認証がされているアカウントのみ' },
];

/**
 * @callback verificationChangeCallback
 * @param {import('discord.js').Client} client
 * @param {Date} date
 */

module.exports = {
    /** @type {verificationChangeCallback} */
    async execute(client, hour) {
        const lists = await require('../../models/verification')(client.sequelize).findAll({ attributes: ['serverId', 'verification', 'oldLevel', 'endChangeTime'] });
        const taskLists = lists.filter(v => v.endChangeTime == hour && v.oldLevel);
        if (!taskLists) return;

        taskLists.forEach(async (v) => {
            const logModel = await require('../../models/log')(client.sequelize).findOne({ where: { serverId: v.serverId } });
            const verificationModel = await require('../../models/verification')(client.sequelize).findOne({ where: { serverId: v.serverId } });
            const { log, logCh } = logModel.get();

            const guild = await client.guilds.fetch(v.serverId).catch(() => {});
            if (!guild) return;

            guild.setVerificationLevel(v.oldLevel)
                .then(async () => {
                    if (!log || !logModel.get('bot')) return;

                    const channel = await guild.channels.fetch(logCh).catch(() => {});
                    if (!channel) return logModel.update({ log: false, logCh: null });
                    const verificationStatus = verificationStatusData.find(w => w.key == v.oldLevel);

                    const errorEmbed = new discord.EmbedBuilder()
                        .setTitle('認証レベル自動変更')
                        .setDescription([
                            `サーバーの認証レベルを**${verificationStatus.name}**に変更しました。`,
                            `\`${verificationStatus.description}\``,
                        ].join('\n'))
                        .setColor('Green');

                    channel.send({ embeds: [errorEmbed] }).catch(() => logModel.update({ log: false, logCh: null }));
                })
                .catch(async () => {
                    verificationModel.update({ verification: false });
                    if (!log || !logModel.get('bot')) return;

                    const channel = await guild.channels.fetch(logCh).catch(() => {});
                    if (!channel) return logModel.update({ log: false, logCh: null });

                    const errorEmbed = new discord.EmbedBuilder()
                        .setTitle('認証レベル自動変更機能')
                        .setDescription([
                            '❌ 機能がOFFになりました。',
                            '**理由:** BOTに`サーバーを管理`権限が付与されていない or **コミュニティサーバー**に認証レベル`無制限`を設定しようとしている',
                        ].join('\n'))
                        .setColor('516ff5');

                    channel.send({ embeds: [errorEmbed] }).catch(() => logModel.update({ log: false, logCh: null }));
                });
        });
    },
};