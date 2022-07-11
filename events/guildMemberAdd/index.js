const discord = require('discord.js');

/**
 * @callback MemberAddCallback
 * @param {discord.Client} client
 * @param {discord.GuildMember} member
 * @returns {void}
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(client, member, Configs, language) {
        if (member.user == client.user) return;
        const config = await Configs.findOne({ where: { serverId: member.guild.id } });
        const { welcome, welcomeCh, welcomeMessage } = config.get();

        if (welcome) {
            member.guild.channels.fetch(welcomeCh)
                .then((channel) => {
                    const embed = new discord.MessageEmbed();
                    if (member.user.bot) {
                        embed.setAuthor({ name: `${language('GUILDMEMBERADD_BOT_TITLE', member.user.username)}`, iconURL: member.user.displayAvatarURL() })
                        .setColor('BLUE');
                    } else {
                        embed.setTitle('WELCOME!')
                        .setDescription(language('GUILDMEMBERADD_MEMBER_DESCRIPTION', [member, member.user.tag, member.guild.name, welcomeMessage, member.guild.memberCount]))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setColor('GREEN')
                        .setTimestamp();
                    }
                    channel.send({ embeds: [embed] }).catch(() => Configs.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } }));
                })
                .catch(() => Configs.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } }));
        }
    },
};