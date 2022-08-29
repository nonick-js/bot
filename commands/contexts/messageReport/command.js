const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').MessageRegister} */
const ping_command = {
    data: {
        name: 'メッセージを通報',
        dmPermission: false,
        type: 'MESSAGE',
    },
    exec: async (interaction) => {
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guild.id } });
        const reportCh = config.get('reportCh');

		if (reportCh == null) {
            const embed = new discord.MessageEmbed()
				.setDescription('⚠️ **この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。')
				.setColor('BLUE');
			if (interaction.member.permissions.has(discord.PermissionFlagsBits.ManageGuild)) {
				embed.setDescription('⚠️ **この機能を使用するには追加で設定が必要です。**\n`/setting`で通報機能の設定を開き、通報を受け取るチャンネルを設定してください。')
					.setImage('https://cdn.discordapp.com/attachments/958791423161954445/976117804879192104/unknown.png');
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		const user = interaction.targetMessage.author;
		// eslint-disable-next-line no-empty-function
		const member = await interaction.guild.members.fetch(user.id).catch(() => {});

		if (!user) {
			const embed = new discord.EmbedBuilder()
				.setDescription('❌ そのユーザーは削除されています！')
				.setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (!member && user.bot && user.discriminator == '0000' || user.system) {
			const embed = new discord.EmbedBuilder()
				.setDescription('❌ Webhookやシステムメッセージを通報することはできません！')
				.setColor('Red');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (user == interaction.client.user) {
            const embed = new discord.EmbedBuilder()
                .setDescription(`❌ **${interaction.client.user.username}**自身を通報することはできません！`)
                .setColor('Red');
            return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (member) {
			if (member == interaction.member) {
				const embed = new discord.EmbedBuilder()
                    .setDescription('自分自身を通報していますよ...')
                    .setColor('White');
                return interaction.reply({ embeds: [embed], ephemeral: true });
			}

			if (member.permissions.has(discord.PermissionFlagsBits.ManageMessages)) {
				const embed = new discord.EmbedBuilder()
					.setDescription('❌ このコマンドでサーバー運営者を通報することはできません！')
					.setColor('Red');
				return interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}

		const modal = new discord.ModalBuilder()
            .setCustomId('messageReport')
            .setTitle('メッセージを通報')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId(interaction.targetMessage.id)
                        .setLabel('通報する理由')
                        .setPlaceholder('通報はサーバー運営にのみ公開されます。Discord公式には送信されません。')
                        .setMaxLength(4000)
                        .setStyle(discord.TextInputStyle.Paragraph)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];