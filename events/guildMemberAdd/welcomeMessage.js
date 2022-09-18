const discord = require('discord.js');
const { welcomeM } = require('../../modules/messageSyntax');

/**
 * @callback MemberAddCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(member) {
        const welcomeMModel = await require('../../models/welcomeM')(member.sequelize).findOne({ where: { serverId: member.guild.id } });
        const logModel = await require('../../models/log')(member.sequelize).findOne({ where: { serverId: member.guild.id } });
        if (!welcomeMModel || !logModel) return;
        const { welcome, welcomeCh, welcomeMessage } = welcomeMModel.get();
        const { log, logCh, bot } = logModel.get();
        if (!welcome) return;

        const channel = await member.guild.channels.fetch(welcomeCh).catch(() => {});

        try {
            if (!channel) throw '**入室メッセージ**がリセットされました。\n**理由:** 送信先のチャンネルが削除されている';
            if (!channel.permissionsFor(member.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) throw '**入室ログ**がリセットされました。\n**理由:** 権限が不足している (`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)';
        } catch (err) {
            welcomeMModel.update({ welcome: false, welcomeCh: null }).catch(() => {});

            if (log && bot) {
                const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                if (!logChannel) return logModel.update({ log: false, logCh: null }).catch(() => {});

                const error = new discord.EmbedBuilder()
                    .setTitle('入退室ログ')
                    .setDescription(`❌ ${err}`)
                    .setColor('516ff5');
                logChannel.send({ embeds: [error] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
            }
            return;
        }

        const welcomeEmbed_member = new discord.EmbedBuilder()
            .setTitle('WELCOME!')
            .setDescription(welcomeM(welcomeMessage, member))
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green');

        const welcomeEmbed_bot = new discord.EmbedBuilder()
            .setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
            .setColor('Blue');

        channel.send({ embeds: [member.user.bot ? welcomeEmbed_bot : welcomeEmbed_member ] })
            .catch(async (err) => {
                welcomeMModel.update({ welcome: false, welcomeCh: null }).catch(() => {});

                if (log && bot) {
                    const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return logModel.update({ log: false, logCh: null }).catch(() => {});

                    const error = new discord.EmbedBuilder()
                        .setTitle('入退室ログ')
                        .setDescription(`❌ **入室メッセージ**がリセットされました。\n**理由:** 不明なエラー\`\`\`${err}\`\`\``)
                        .setColor('516ff5');

                    logChannel.send({ embeds: [error] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
                }
            });
    },
};