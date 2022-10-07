const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');
const { welcomeM } = require('../../modules/messageSyntax');

module.exports = {
	/** @param {discord.GuildMember} member */
  async execute(member) {
		const Config = await Configs.findOne({ serverId: member.guild.id });
		const welcome = Config.welcome;

		if (!welcome) return;

		const channel = await member.guild.channels.fetch(welcome.channel).catch(() => {});
		if (!channel) {
			welcome.enable = false;
			welcome.channel = null;
			return Config.save({ wtimeout: 1500 });
		}

		const welcomeEmbed_member = new discord.EmbedBuilder()
			.setTitle('WELCOME！')
			.setDescription(welcomeM(welcome.message, member))
			.setThumbnail(member.user.displayAvatarURL())
			.setColor('Green');

		const welcomeEmbed_bot = new discord.EmbedBuilder()
			.setAuthor({ name: `${member.user.username} が連携されました`, iconURL: member.user.displayAvatarURL() })
			.setColor('Blue');

		channel.send({ embeds: [member.user.bot ? welcomeEmbed_bot : welcomeEmbed_member] }).catch(() => {});
  },
};