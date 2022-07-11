const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.Client} client
 * @param {discord.GuildMember} member
 * @returns {void}
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(client, member, Configs, language) {
        const config = await Configs.findOne({ where: { serverId: member.guild.id } });
        const { leave, leaveCh } = config.get();

        if (leave && member !== member.guild.me) {
            member.guild.channels.fetch(leaveCh)
                .then((channel) => {
                    if (member.user.bot) {
                        const embed = new discord.MessageEmbed()
                            .setAuthor({ name: `${language('GUILDMEMBERREMOVE_BOT_TITLE', member.user.username)}`, iconURL: member.displayAvatarURL() })
                            .setColor('RED');
                        channel.send({ embeds: [embed] }).catch(() => Configs.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
                    } else {
                        channel.send(language('GUILDMEMBERREMOVE_MEMBER', member.user.tag)).catch(() => Configs.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
                    }
                })
                .catch(() => Configs.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
        }
    },
};