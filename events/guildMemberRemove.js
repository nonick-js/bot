const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.Client} client
 * @param {discord.GuildMember} member
 * @returns {void}
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(client, member, Configs) {
        await Configs.findOrCreate({ where: { serverId: member.guild.id } });
        const config = await Configs.findOne({ where: { serverId: member.guild.id } });
        const leave = config.get('leave');

        if (leave && member !== member.guild.me) {
            const leaveCh = config.get('leaveCh');
            member.guild.channels.fetch(leaveCh)
                .then((channel) => {
                    if (member.user.bot) {
                        const embed = new discord.MessageEmbed()
                            .setAuthor({ name: `${member.user.username} が廃止されました`, iconURL: member.displayAvatarURL() })
                            .setColor('RED');
                        channel.send({ embeds: [embed] }).catch(() => {
                            Configs.update({ leave: false }, { where: { serverId: member.guild.id } });
                            Configs.update({ leaveCh: null }, { where: { serverId: member.guild.id } });
                        });
                    }
                    else {
                        channel.send(`**${member.user.tag}** さんがサーバーを退出しました👋`).catch(() => {
                            Configs.update({ leave: false }, { where: { serverId: member.guild.id } });
                            Configs.update({ leaveCh: null }, { where: { serverId: member.guild.id } });
                        });
                    }
                })
                .catch(() => {
                    Configs.update({ leave: false }, { where: { serverId: member.guild.id } });
                    Configs.update({ leaveCh: null }, { where: { serverId: member.guild.id } });
                });
        }
    },
};