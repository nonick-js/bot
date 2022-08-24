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
        const config = await Configs.findOne({ where: { serverId: member.guild.id } });
        const { welcome, welcomeCh, welcomeMessage } = config.get();

        if (welcome) {
            member.guild.channels.fetch(welcomeCh)
                .then((channel) => {
                    const embed = new discord.MessageEmbed();
                    if (member.user.bot) {
                        embed.setAuthor({ name: `${member.user.username} が導入されました！`, iconURL: member.user.displayAvatarURL() });
                        embed.setColor('BLUE');
                    } else {
                        embed.setTitle('WELCOME!');
                        embed.setDescription([
                                `${member} **(${member.user.tag})** さん`,
                                `**${member.guild.name}** へようこそ!`,
                                `${welcomeMessage}\n`,
                                `現在のメンバー数: **${member.guild.memberCount}人**`,
                            ].join('\n'));
                        embed.setThumbnail(member.user.displayAvatarURL());
                        embed.setColor('GREEN');
                    }
                    channel.send({ embeds: [embed] }).catch(() => Configs.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } }));
                })
                .catch(() => Configs.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } }));
        }
    },
};