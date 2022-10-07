const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');
const { welcomeM } = require('../../modules/messageSyntax');

module.exports = {
	/** @param {discord.GuildMember} member */
	async execute(member) {
		const Config = await Configs.findOne({ serverId: member.guild.id });
		const leave = Config.leave;
		if (!leave.enable) return;

		const channel = await member.guild.channels.fetch(leave.channel).catch(() => {});
		if (!channel) {
			leave.enable = false;
			leave.channel = null;
			Config.save({ wtimeout: 1500 });
		}

		const content = welcomeM(leave.message, member);
		const embed = new discord.EmbedBuilder()
			.setAuthor({ name: `${member.user.username} との連携が解除されました`, iconURL: member.displayAvatarURL() })
			.setColor('Red');

		channel.send({ content: member.user.bot ? '' : content, embeds: member.user.bot ? [embed] : undefined }).catch();
	},
};