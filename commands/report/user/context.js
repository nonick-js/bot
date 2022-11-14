const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').UserRegister} */
const userContextMenu = {
  data: {
    name: 'ユーザーを通報',
    dmPermission: false,
    type: 'USER',
  },
  exec: async (interaction) => {
		const basicModel = await require('../../../models/basic')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });
		const { reportCh } = basicModel.get();

		const user = interaction.targetUser;
		const member = interaction.targetMember;

		if (!reportCh) {
			const warnEmbed_admin = new discord.EmbedBuilder()
				.setDescription('**この機能を使用するには追加で設定が必要です。**\n`/setting`で通報機能の設定を開き、通報を受け取るチャンネルを設定してください。')
				.setColor('Blue')
				.setImage('https://cdn.discordapp.com/attachments/958791423161954445/976117804879192104/unknown.png');

			const warnEmbed = new discord.EmbedBuilder()
				.setDescription('**この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。')
				.setColor('Blue');

			return interaction.reply({ embeds: [interaction.member.permissions.has(discord.PermissionFlagsBits.ManageGuild) ? warnEmbed_admin : warnEmbed], ephemeral: true });
		}

		try {
			if (!user) throw 'そのユーザーは通報できません！';
			if (user.system) throw 'システムメッセージは通報できません！';
			if (user == interaction.user) throw '自分自身を通報しようとしています...';
			if (member == interaction.guild.members.me) throw `${interaction.client.user.username} 自身を通報することはできません！`;
			if (member?.permissions?.has(discord.PermissionFlagsBits.ManageMessages)) throw 'このコマンドでサーバー運営者を通報することはできません！';
		} catch (err) {
			const errorEmbed = new discord.EmbedBuilder()
				.setAuthor({ name: err, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
				.setColor('Red');
			return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
		}

		const modal = new discord.ModalBuilder()
      .setCustomId('userReport')
      .setTitle('メンバーを通報')
			.addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId(interaction.targetUser.id)
            .setLabel('通報する理由')
            .setPlaceholder('通報はサーバー運営にのみ公開され、Discord公式に送信されることはありません。')
						.setMaxLength(4000)
            .setStyle(discord.TextInputStyle.Paragraph),
        ),
			);
    interaction.showModal(modal);
  },
};

module.exports = [ userContextMenu ];