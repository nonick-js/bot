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
        const UserAvater = infoUser.displayAvatarURL()
        const nickAvater = infoMember.displayAvatarURL();
        const UserCreateTime = Math.floor(infoUser.createdTimestamp/1000);
        const MemberJoinTime = Math.floor(infoMember.joinedTimestamp/1000);
        let nickName = infoMember.nickname;

        console.log(infoMember.roles.highest.color)

        if(nickName == null) nickName = "なし";

        const embed = new discord.MessageEmbed()
            .setThumbnail(UserAvater)
            .setAuthor({name: `${infoUser.tag}`})
            .setDescription(`ニックネーム: **${nickName}**\nユーザーID:`+discord.Formatters.inlineCode(`${infoUser.id}`))
            .addFields(
                {name: 'アカウント作成日', value: discord.Formatters.time(UserCreateTime, 'D'), inline:true},
                {name: 'サーバー参加日', value: discord.Formatters.time(MemberJoinTime, 'D'), inline:true},
            )
            .setColor(infoMember.roles.highest.color);
        if (infoMember.roles.highest.color = 0) embed.setColor('WHITE');
        if (UserAvater !== nickAvater) {
            embed.setAuthor({name: `${infoUser.tag}`, iconURL: `${UserAvater}`});
            embed.setThumbnail(nickAvater);
        }
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}