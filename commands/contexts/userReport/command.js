// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').UserRegister} */
const ping_command = {
    data: {
        name: 'ユーザーを通報',
        dmPermission: false,
        type: 'USER',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });
        const { reportCh } = config.get();

		const user = interaction.targetUser;
		const member = interaction.targetMember;

		try {
			if (!reportCh && interaction.member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) throw '**この機能を使用するには追加で設定が必要です。**\n`/setting`で通報機能の設定を開き、通報を受け取るチャンネルを設定してください。';
			if (!reportCh) throw '**この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。';
		} catch (warn) {
			const warnEmbed = new discord.EmbedBuilder()
				.setDescription(`⚠️ ${warn}`)
				.setColor('Blue')
				.setImage(interaction.member.permissions.has(discord.PermissionFlagsBits.ManageGuild) ? 'https://cdn.discordapp.com/attachments/958791423161954445/976117804879192104/unknown.png' : null);
			return interaction.reply({ embeds: [warnEmbed], ephemeral: true });
		}

		try {
			if (!user) throw 'そのユーザーは通報できません！';
			if (user.system) throw 'システムメッセージは通報できません！';
			if (!member && user.bot && user.discriminator == '0000') throw 'Webhookは通報できません！';
			if (user == interaction.user) throw '自分自身を通報しようとしています...';
			if (member == interaction.guild.members.me) throw `**${interaction.client.user.username}**自身を通報することはできません！`;
			if (member?.permissions?.has(discord.PermissionFlagsBits.ManageMessages)) throw 'このコマンドでサーバー運営者を通報することはできません！';
		} catch (err) {
			const errorEmbed = new discord.EmbedBuilder()
				.setDescription(`❌ ${err}`)
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
module.exports = [ ping_command ];