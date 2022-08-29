const discord = require('discord.js');

/**
 * @callback MemberRemoveCallback
 * @param {discord.GuildMember} member
 */

module.exports = {
    /** @type {MemberRemoveCallback} */
    async execute(member) {
        const config = await member.db_config.findOne({ where: { serverId: member.guild.id } });
        const { leave, leaveCh } = config.get();
        if (!leave) return;

        // eslint-disable-next-line no-empty-function
        const channel = await member.guild.channels.fetch(leaveCh).catch(() => {});
        if (!channel) member.db_config.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } });

        if (member.user.bot) {
            const embed = new discord.EmbedBuilder()
                .setAuthor({ name: `${member.user.username} との連携が解除されました`, iconURL: member.displayAvatarURL() })
                .setColor('Red');
            channel.send({ embeds: [embed] })
                .catch(() => member.db_config.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
        }
        else {
            channel.send(`**${member.user.tag}** がサーバーを退出しました👋`)
                .catch(() => member.db_config.update({ leave: false, leaveCh: null }, { where: { serverId: member.guild.id } }));
        }
    },
};