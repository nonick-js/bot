const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
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
        const member = await interaction.guild.members.fetch(user);

        const nickName = member.nickname ?? language('USERINFO_NONE');
        const createTime = Math.floor(user.createdTimestamp / 1000);
        const joinTime = Math.floor(member.joinedTimestamp / 1000);
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
                `${language('USERINFO_NICKNAME', nickName)}`,
                `${language('USERINFO_USERID', user.id)}`,
            ].join('\n'))
            .addFields(
                { name: `${language('USERINFO_CREATETIME')}`, value: discord.Formatters.time(createTime, 'D'), inline:true },
                { name: `${language('USERINFO_JOINTIME')}`, value: discord.Formatters.time(joinTime, 'D'), inline:true },
                { name: `${language('USERINFO_ROLE')}`, value: roles },
            )
            .setColor(member.roles.highest.color);

		if (boostTime !== 0) embed.addFields({ name: '🎉SERVER BOOST', value: `${language('USERINFO_BOOSTTIME'), boostTime}` });
        if (embed.color == 0) {embed.setColor('WHITE');}
        if (user.displayAvatarURL() !== member.displayAvatarURL()) {
            embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
            embed.setThumbnail(member.displayAvatarURL());
        }
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};