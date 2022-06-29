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
        const config = await Configs.findOne({ where: { serverId: member.guild.id } });
        const { leave, leaveCh } = config.get();

        if (leave && member !== member.guild.me) {
            member.guild.channels.fetch(leaveCh)
                .then((channel) => {
                    if (member.user.bot) {
                        const embed = new discord.MessageEmbed()
                            .setAuthor({ name: `${member.user.username} が廃止されました`, iconURL: member.displayAvatarURL() })
                            .setColor('RED');
                        channel.send({ embeds: [embed] }).catch(() => Configs.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
                    } else {
                        channel.send(`**${member.user.tag}** さんがサーバーを退出しました👋`).catch(() => Configs.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
                    }
                })
                .catch(() => Configs.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
        }
    },
};