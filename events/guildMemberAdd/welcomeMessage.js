const discord = require('discord.js');

/**
 * @callback MemberAddCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberAddCallback} */
    async execute(member) {
        const config = await member.db_config.findOne({ where: { serverId: member.guild.id } });
        const { welcome, welcomeCh, welcomeMessage } = config.get();
        if (!welcome) return;

        // eslint-disable-next-line no-empty-function
        const channel = await member.guild.channels.fetch(welcomeCh).catch(() => {});
        if (!channel) return member.db_config.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } });

        const welcomeEmbed_member = new discord.EmbedBuilder()
            .setTitle('WELCOME!')
            .setDescription([
                `${member} **(${member.user.tag})** さん`,
                `**${member.guild.name}** へようこそ!`,
                `${welcomeMessage}\n`,
                `現在のメンバー数: **${member.guild.memberCount}人**`,
            ].join('\n'))
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('Green');

        const welcomeEmbed_bot = new discord.EmbedBuilder()
            .setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
            .setColor('Blue');

        channel.send({ embeds: [member.user.bot ? welcomeEmbed_bot : welcomeEmbed_member] })
            .catch(() => member.db_config.update({ welcome: false, welcomeCh: null }, { where: { serverId: member.guild.id } }));
    },
};