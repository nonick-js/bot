const discord = require('discord.js');

/**
 * @callback MemberAddCallback
 * @param {discord.Client} client
 * @param {discord.GuildMember} member
 * @returns {void}
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(client, member, Configs) {
        await Configs.findOrCreate({ where:{ serverId: member.guild.id } });
        const config = await Configs.findOne({ where: { serverId: member.guild.id } });
        const welcome = config.get('welcome');

        if (welcome && member !== member.guild.me) {
            const welcomeCh = config.get('welcomeCh');
            const welcomeMessage = config.get('welcomeMessage');

            member.guild.channels.fetch(welcomeCh)
                .then((channel) => {
                    const embed = new discord.MessageEmbed();
                    if (member.user.bot) {
                        embed.setAuthor({ name: `${member.user.username} が導入されました!`, iconURL: member.user.displayAvatarURL() })
                        .setColor('BLUE');
                    }
                    else {
                        embed.setTitle('WELCOME!')
                        .setDescription([
                            `<@${member.id}>**(${member.user.tag})** さん`,
                            `**${member.guild.name}** へようこそ!`,
                            `${welcomeMessage}`,
                            `\n現在のメンバー数:**${member.guild.memberCount}**人`,
                        ].join('\n'))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setColor('GREEN')
                        .setTimestamp();
                    }
                    channel.send({ embeds: [embed] }).catch(() => {
                        Configs.update({ welcome: false }, { where: { serverId: member.guild.id } });
                        Configs.update({ welcomeCh: null }, { where: { serverId: member.guild.id } });
                    });

                })
                .catch(() => {
                    Configs.update({ welcome: false }, { where: { serverId: member.guild.id } });
                    Configs.update({ welcomeCh: null }, { where: { serverId: member.guild.id } });
                });
        }
    },
};