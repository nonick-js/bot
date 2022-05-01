const fs = require('fs');
const { ApplicationCommandType } = require('discord-api-types/v10');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const discord = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('このユーザーの情報')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const infoUser = interaction.targetUser
        const infoMember = await interaction.guild.members.fetch(infoUser);
        console.log(infoMember)

        const Usertag = infoUser.tag;
        const UserName = infoUser.username;
        const UserAvater = infoUser.displayAvatarURL();
        const UserCreateTime = infoUser.createdTimestamp;

        const MemberName = infoMember.nickname;
        const MemberAvater = infoMember.displayAvatarURL();
        const MemberJoinTime = infoMember.joinedTimestamp;

        const embed = new discord.MessageEmbed()
            .addFields(
                {name: 'アカウント作成日', value: UserCreateTime},
                {name: 'サーバー参加日', value: MemberJoinTime},
            )

        if (UserAvater == MemberAvater) {
            embed.setAuthor({ name: `${UserName}` + `${Usertag}`});
            embed.setThumbnail(UserAvater);
        } else {
            embed.setAuthor({ name: `${UserName}` + `${Usertag}`, iconURL: `${UserAvater}` });
            embed.setThumbnail(MemberAvater);
        }

        if (MemberName) {
            embed.setTitle(MemberName);
        } else {
            embed.setTitle(UserName);
        }

        interaction.reply({embeds: [embed], ephemeral: true});
	}
}