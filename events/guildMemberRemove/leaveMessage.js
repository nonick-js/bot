const discord = require('discord.js');
const { welcomeM } = require('../../modules/messageSyntax');

/**
 * @callback MemberRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(member) {
        const welcomeMModel = await require('../../models/welcomeM')(member.sequelize).findOne({ where: { serverId: member.guild.id } });
        const logModel = await require('../../models/log')(member.sequelize).findOne({ where: { serverId: member.guild.id } });

        if (!welcomeMModel || !logModel) return;
        const { leave, leaveCh, leaveMessage } = welcomeMModel.get();
        const { log, logCh, bot } = logModel.get();
        if (!leave) return;

        const channel = await member.guild.channels.fetch(leaveCh).catch(() => {});

        try {
            if (!channel) throw '**退室メッセージ**がリセットされました。\n**理由:** 送信先のチャンネルが削除されている';
            if (!channel.permissionsFor(member.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) throw '**退室ログ**がリセットされました。\n**理由:** 権限が不足している (`チャンネルを見る` `メッセージを送信` `埋め込みリンク`)';
        } catch (err) {
            welcomeMModel.update({ leave: false, leaveCh: null }).catch(() => {});

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

        const embed = new discord.EmbedBuilder()
            .setAuthor({ name: `${member.user.username} との連携が解除されました`, iconURL: member.displayAvatarURL() })
            .setColor('Red');

        const content = welcomeM(leaveMessage, member);

        channel.send({ content: member.user.bot ? '' : content, embeds: member.user.bot ? [embed] : undefined })
            .catch(async (err) => {
                welcomeMModel.update({ leave: false, leaveCh: null }).catch(() => {});

                if (log && bot) {
                    const logChannel = await member.guild.channels.fetch(logCh).catch(() => {});
                    if (!logChannel) return logModel.update({ log: false, logCh: null }).catch(() => {});

                    const error = new discord.EmbedBuilder()
                        .setTitle('入退室メッセージ')
                        .setDescription(`❌ **退室メッセージ**がリセットされました。\n**理由:** 不明なエラー\`\`\`${err}\`\`\``)
                        .setColor('516ff5');
                    logChannel.send({ embeds: [error] }).catch(() => logModel.update({ log: false, logCh: null }).catch(() => {}));
                }
            });
    },
};