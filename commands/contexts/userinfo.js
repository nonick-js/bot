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
    exec: async (client, interaction, Configs, language) => {
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
                    `${language('UserInfo.Embed.Member_Undef')}`,
                    `${language('UserInfo.Embed.UserId', user.id)}`,
                ].join('\n'))
                .addFields(
                    { name: `${language('UserInfo.Embed.CreateTime')}`, value: createTime },
                );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const nickName = member.nickname ?? language('USERINFO_NONE');
        const joinTime = discord.Formatters.time(Math.floor(member.joinedTimestamp / 1000), 'D');
		const boostTime = Math.floor(member.premiumSinceTimestamp / 1000);
        const roleCollection = member.roles.cache.filter(role => role.name !== '@everyone').sort((before, after) => {
            if (before.position > after.position) return -1;
            return 1;
        });
        const roles = roleCollection.size ? roleCollection.map(role => role.toString()).join(' ') : language('USERINFO_NONE');

        const embed = new discord.MessageEmbed()
            .setThumbnail(member.displayAvatarURL())
            .setAuthor({ name: user.tag })
            .setDescription([
                `${language('UserInfo.Embed.UserId', user.id)}`,
                `${language('UserInfo.Embed.NickName', nickName)}`,
            ].join('\n'))
            .addFields(
                { name: `${language('UserInfo.Embed.CreateTime')}`, value: createTime, inline:true },
                { name: `${language('UserInfo.Embed.JoinTime')}`, value: joinTime, inline:true },
                { name: `${language('UserInfo.Embed.Role')}`, value: roles },
            )
            .setColor(member.roles.highest.color);

		if (boostTime) embed.addFields({ name: '🎉SERVER BOOST', value: `${language('UserInfo.BoostTime'), boostTime}` });
        if (!embed.color) embed.setColor('WHITE');
        if (user.displayAvatarURL() !== member.displayAvatarURL()) {
            embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
            embed.setThumbnail(member.displayAvatarURL());
        }
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};