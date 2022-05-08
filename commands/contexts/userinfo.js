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
        const infoUser2 = await client.users.fetch(interaction.targetUser.id)
        const infoMember = await interaction.guild.members.fetch(infoUser);

        const UserAvater = infoUser.displayAvatarURL()
        const UserCreateTime = Math.floor(infoUser.createdTimestamp/1000);

        const MemberName = infoMember.nickname;
        const MemberAvater = infoMember.displayAvatarURL();
        const MemberJoinTime = Math.floor(infoMember.joinedTimestamp/1000);

        const embed = new discord.MessageEmbed()
            .setThumbnail(UserAvater)
            .setAuthor({name: `${infoUser.tag}`})
            .addFields(
                {name: "ユーザーID", value: discord.Formatters.inlineCode(`${infoUser.id}`)}
            )
            .setColor(infoMember.roles.highest.color);

        if (UserAvater !== MemberAvater) {
            embed.setAuthor({name: `${infoUser.tag}`, iconURL: `${UserAvater}`});
            embed.setThumbnail(MemberAvater);
        }

        embed.addFields(
            {name: 'アカウント作成日', value: discord.Formatters.time(UserCreateTime), inline:true},
            {name: 'サーバー参加日', value: discord.Formatters.time(MemberJoinTime), inline:true},
        )

        interaction.reply({embeds: [embed], ephemeral: true});
    }
}