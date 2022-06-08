const fs = require('fs');
const discord = require('discord.js');

module.exports = {
    async execute(client, member, Configs) {
        await Configs.findOrCreate({where:{serverId: member.guild.id}});
        if (member !== member.guild.me) {
            const config = await Configs.findOne({where: {serverId: member.guild.id}});
            const leave = config.get('welcome');
            const leaveCh = config.get('welcomeCh');
            if (leave) {
                member.guild.channels.fetch(leaveCh)
                .then((channel) => {
                    channel.send(`**${member.user.username}** さんがサーバーを退出しました👋`)
                    .catch(() => {
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