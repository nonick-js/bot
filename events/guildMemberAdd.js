const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    async execute(member, client, Configs) {
        await Configs.findOrCreate({where:{serverId: member.guild.id}});
        if (member !== member.guild.me) {
            const config = await Configs.findOne({where: {serverId: member.guild.id}});
            const welcome = config.get('welcome');
            const welcomeCh = config.get('welcomeCh');
            const welcomeMessage = config.get('welcomeMessage');
            if (welcome) {
                member.guild.channels.fetch(welcomeCh)
                .then((channel) => {
                    const embed = new discord.MessageEmbed()
                        .setTitle('WELCOME!')
                        .setDescription(`**<@${member.id}>**さん\n**${member.guild.name}** へようこそ!\n${welcomeMessage}\n\n現在のメンバー数:**${member.guild.memberCount}**人`)
                        .setThumbnail(member.user.displayAvatarURL())
                        .setColor('#57f287');
                    channel.send({embeds: [embed]}).catch(() => {
                        Configs.update({welcome: false}, {where: {serverId: member.guild.id}});
                        Configs.update({welcomeCh: null}, {where: {serverId: member.guild.id}});
                    });
                })
                .catch(() => {
                    Configs.update({welcome: false}, {where: {serverId: member.guild.id}});
                    Configs.update({welcomeCh: null}, {where: {serverId: member.guild.id}});
                });
            }
        }
    }
}