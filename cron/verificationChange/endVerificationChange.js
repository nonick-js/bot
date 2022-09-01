// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const verificationStatusData = [
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
        const lists = await client.db_verificationConfig.findAll({ attributes: ['serverId', 'oldLevel', 'endChangeTime'] });
        const taskLists = lists.filter(v => v.endChangeTime == hour && v.oldLevel);
        if (!taskLists) return;

        taskLists.forEach(async (v) => {
            const config = await client.db_config.findOne({ where: { serverId: v.serverId } });
            const logConfig = await client.db_logConfig.findOne({ where: { serverId: v.serverId } });
            const { verification, log, logCh } = config.get();
            if (!verification) return;

            const guild = await client.guilds.fetch(v.serverId).catch(() => {});
            if (!guild) return;

            guild.setVerificationLevel(v.oldLevel)
                .then(async () => {
                    if (!log || !logConfig.get('botLog')) return;

                    const channel = await guild.channels.fetch(logCh).catch(() => {});
                    if (!channel) return client.db_config.update({ log: false, logCh: null }, { where: { serverId: guild.id } });
                    const verificationStatus = verificationStatusData.find(w => w.key == v.oldLevel);

                    const errorEmbed = new discord.EmbedBuilder()
                        .setTitle('認証レベル自動変更')
                        .setDescription([
                            `サーバーの認証レベルを**${verificationStatus.name}**に変更しました。`,
                            `\`${verificationStatus.description}\``,
                        ].join('\n'))
                        .setColor('Green');

                    channel.send({ embeds: [errorEmbed] }).catch(() => client.db_config.update({ log: false, logCh: null }, { where: { serverId: guild.id } }));
                })
                .catch(async (e) => {
                    console.log(e);

                    client.db_config.update({ verification: false }, { where: { serverId: guild.id } });
                    if (!log || !logConfig.get('botLog')) return;

                    const channel = await guild.channels.fetch(logCh).catch(() => {});
                    if (!channel) return client.db_config.update({ log: false, logCh: null }, { where: { serverId: guild.id } });

                    const errorEmbed = new discord.EmbedBuilder()
                        .setTitle('認証レベル自動変更機能')
                        .setDescription([
                            '❌ 機能がOFFになりました。',
                            '**理由:** BOTに`サーバーを管理`権限が付与されていない',
                        ].join('\n'))
                        .setColor('516ff5');

                    channel.send({ embeds: [errorEmbed] }).catch(() => client.db_config.update({ log: false, logCh: null }, { where: { serverId: guild.id } }));
                });
        });
    },
};