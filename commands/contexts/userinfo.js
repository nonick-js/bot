const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'このユーザーの情報', nameLocalizations: { 'en-US': 'Information this user' }, type: 'USER' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction) => {
        /** @type {discord.User} */
        const user = interaction.targetUser;
        const createTime = discord.Formatters.time(Math.floor(user.createdTimestamp / 1000), 'D');

        /** @type {discord.GuildMember} */
        // eslint-disable-next-line no-empty-function
        const member = await interaction.guild.members.fetch(user).catch(() => {});
        if (!member) {
            const embed = new discord.MessageEmbed()
                .setAuthor({ name: user.tag })
                .setThumbnail(user.displayAvatarURL())
                .setColor('WHITE')
                .setDescription([
                    '**このユーザーはサーバーにいません**',
                    `${discord.Formatters.formatEmoji('973880625641705522')} ユーザーID: \`${user.id}\``,
                ].join('\n'))
                .addFields(
                    { name: 'アカウント作成日', value: createTime },
                );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const nickName = member.nickname ?? '__なし__';
        const joinTime = discord.Formatters.time(Math.floor(member.joinedTimestamp / 1000), 'D');
		const boostTime = Math.floor(member.premiumSinceTimestamp / 1000);
        const roleCollection = member.roles.cache.filter(role => role.name !== '@everyone').sort((before, after) => {
            if (before.position > after.position) return -1;
            return 1;
        });
        const roles = roleCollection.size ? roleCollection.map(role => role.toString()).join(' ') : '__なし__';

        const embed = new discord.MessageEmbed()
            .setThumbnail(member.displayAvatarURL())
            .setAuthor({ name: user.tag })
            .setDescription([
                `${discord.Formatters.formatEmoji('973880625566212126')} ニックネーム: **${nickName}**`,
                `${discord.Formatters.formatEmoji('973880625641705522')} ユーザーID: \`${user.id}\``,
            ].join('\n'))
            .addFields(
                { name: 'アカウント作成日', value: createTime, inline:true },
                { name: 'サーバー参加日', value: joinTime, inline:true },
                { name: 'ロール', value: roles },
            )
            .setColor(member.roles.highest.color);

		if (boostTime) embed.addFields({ name: '🎉SERVER BOOST', value: `ブーストを開始した日: ${discord.Formatters.time(boostTime, 'D')}` });
        if (!embed.color) embed.setColor('WHITE');
        if (user.displayAvatarURL() !== member.displayAvatarURL()) {
            embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
            embed.setThumbnail(member.displayAvatarURL());
        }
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};