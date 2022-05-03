const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('このユーザーの情報')
        .setType(ApplicationCommandType.User),
    async execute(interaction,client) {
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
    
        if (infoUser2.bannerURL()) {
            embed.setImage(infoUser2.bannerURL());
        }

        embed.addFields(
            {name: 'アカウント作成日', value: discord.Formatters.time(UserCreateTime), inline:true},
            {name: 'サーバー参加日', value: discord.Formatters.time(MemberJoinTime), inline:true},
        )

        interaction.reply({embeds: [embed], ephemeral: true});
	}
}