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
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {name: "このユーザーの情報", type: "USER"},
    /**@type {InteractionCallback} */
    exec: async (interaction, client) => {
        const infoUser = interaction.targetUser
        const infoMember = await interaction.guild.members.fetch(infoUser);
        const UserAvater = infoUser.displayAvatarURL();
        const nickAvater = infoMember.displayAvatarURL();
        const UserCreateTime = Math.floor(infoUser.createdTimestamp/1000);
        const MemberJoinTime = Math.floor(infoMember.joinedTimestamp/1000);
		const MemberBoostTime = Math.floor(infoMember.premiumSinceTimestamp/1000);
        let nickName = infoMember.nickname;

        if(nickName == null) nickName = "なし";
        let roles;
        const roleCollection = infoMember.roles.cache.sort(function(beforeRole, afterRole) {
            if (beforeRole.position > afterRole.position) {
                return -1;
            } else {
                return 1;
            }
        })
        if (roleCollection.size !== 1) {
            roleCollection.forEach(role => {
                if (roles == undefined) {roles = `<@&${role.id}> `;}
                else if (role.name !== "@everyone") {roles = roles + `<@&${role.id}> `;}
            });
        } else {
			roles = "なし";
		}

        const embed = new discord.MessageEmbed()
            .setThumbnail(UserAvater)
            .setAuthor({name: `${infoUser.tag}`})
            .setDescription(discord.Formatters.formatEmoji('973880625566212126') + `ニックネーム: **${nickName}**\n` + discord.Formatters.formatEmoji('973880625641705522') + 'ユーザーID: ' + discord.Formatters.inlineCode(`${infoUser.id}`))
            .addFields(
                {name: 'アカウント作成日', value: discord.Formatters.time(UserCreateTime, 'D'), inline:true},
                {name: 'サーバー参加日', value: discord.Formatters.time(MemberJoinTime, 'D'), inline:true},
                {name: 'ロール', value: roles}
            )
            .setColor(infoMember.roles.highest.color);

		if (MemberBoostTime !== 0) {embed.addFields({name: "🎉SERVER BOOST", value: '最後にブーストした日:'+discord.Formatters.time(MemberBoostTime, 'D')});}
        if (embed.color == 0) {embed.setColor('WHITE');}
        if (UserAvater !== nickAvater) {
            embed.setAuthor({name: `${infoUser.tag}`, iconURL: `${UserAvater}`});
            embed.setThumbnail(nickAvater);
        }
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}