const discord = require('discord.js');
const flagEmoji = {
    Staff:'966753508739121222',
    Partner: '966753508860768357',
    Hypesquad:'966753508961439745',
    BugHunterLevel1: '966753508848205925',
    HypeSquadOnlineHouse1: '966753508843978872',
    HypeSquadOnlineHouse2: '966753508927889479',
    HypeSquadOnlineHouse3: '966753508776890459',
    PremiumEarlySupporter: '966753508751736892',
    BugHunterLevel2: '966753508755898410',
    VerifiedDeveloper: '966753508705583174',
    CertifiedModerator:'959536411894243378',
};

/** @type {import('@djs-tools/interactions').UserRegister} */
const ping_command = {
    data: {
        name: 'ユーザーの情報',
        dmPermission: false,
        type: 'USER',
    },
    exec: async (interaction) => {
        await interaction.deferReply();

        const createTime = discord.time(Math.floor(interaction.targetUser.createdTimestamp / 1000), 'D');
        const flags = interaction.targetUser.flags.toArray().filter(v => flagEmoji[v]).map(v => discord.formatEmoji(flagEmoji[v])).join('');

        if (!interaction.targetMember) {
            const embed = new discord.EmbedBuilder()
                .setAuthor({ name: interaction.targetUser.tag })
                .setThumbnail(interaction.targetUser.displayAvatarURL())
                .setColor('White')
                .setDescription([
                    '**このユーザーはこのサーバーにいません**',
                    `${discord.formatEmoji('1005688192818761748')} ユーザーID: \`${interaction.targetId}\``,
                ].join('\n'))
                .addFields(
                    { name: 'アカウント作成日', value: createTime, inline: true },
                    { name: 'フラッグ', value: flags || 'なし', inline: true },
                );
            return interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        const nickName = interaction.targetMember.nickname;
        const joinTime = discord.time(Math.floor(interaction.targetMember.joinedTimestamp / 1000), 'D');
        const boostTime = Math.floor(interaction.targetMember.premiumSinceTimestamp / 1000);
        const roles = interaction.targetMember.roles.cache.filter(role => role.name !== '@everyone').sort((before, after) => {
            if (before.position > after.position) return -1;
            return 1;
        })?.map(role => role.toString())?.join(' ');

        const embed = new discord.EmbedBuilder()
            .setThumbnail(interaction.targetMember.displayAvatarURL())
            .setAuthor({ name: interaction.targetUser.tag })
            .setDescription([
                `${discord.formatEmoji('1005688190931320922')} ニックネーム: **${nickName || 'なし'}**`,
                `${discord.formatEmoji('1005688192818761748')} ユーザーID: \`${interaction.targetId}\``,
            ].join('\n'))
            .setColor(interaction.targetMember.roles.highest.color || 'White')
            .setFields(
                { name: 'アカウント作成日', value: createTime, inline:true },
                { name: 'サーバー参加日', value: joinTime, inline:true },
                { name: 'フラッグ', value: flags || 'なし', inline: true },
                { name: 'ロール', value: roles || 'なし' },
            );

        if (boostTime) embed.addFields({ name: `${discord.formatEmoji('896591259886567434')} SERVER BOOST`, value: `ブーストを開始した日: ${discord.time(boostTime, 'D')} (${discord.time(boostTime, 'R')})` });
        if (interaction.targetUser.displayAvatarURL() !== interaction.targetMember.displayAvatarURL()) {
            embed.setAuthor({ name: interaction.targetUser.tag, iconURL: interaction.targetUser.displayAvatarURL() });
            embed.setThumbnail(interaction.targetMember.displayAvatarURL());
        }
        interaction.followUp({ embeds: [embed], ephemeral: true });
    },
};
module.exports = [ ping_command ];