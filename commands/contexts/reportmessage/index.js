const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ContextMenuInteraction} interaction
* @param {...any} [args]
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'メッセージを通報', nameLocalizations: { 'en-US': 'Report this message' }, type: 'MESSAGE' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {

		const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const reportCh = config.get('reportCh');

		if (reportCh == null) {
            const embed = new discord.MessageEmbed()
				.setDescription('⚠️ **この機能を使用するには追加で設定が必要です。**\nBOTの設定権限を持っている人に連絡してください。')
				.setColor('BLUE');
			if (interaction.member.permissions.has('MANAGE_GUILD')) {
				embed.setDescription('⚠️ **この機能を使用するには追加で設定が必要です。**\n`/setting`で通報機能の設定を開き、通報を受け取るチャンネルを設定してください。')
					.setImage('https://cdn.discordapp.com/attachments/958791423161954445/976117804879192104/unknown.png');
			}
			return interaction.reply({ embeds: [embed], ephemeral:true });
		}

		const user = interaction.targetMessage.author;
		// eslint-disable-next-line no-empty-function
		const member = await interaction.guild.members.fetch(user.id).catch(() => {});

		if (!user) {
			const embed = new discord.MessageEmbed()
				.setDescription('❌ そのユーザーは削除されています!')
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (!member && user.bot && user.discriminator == '0000' || user.system) {
			const embed = new discord.MessageEmbed()
				.setDescription('❌ Webhookやシステムメッセージを通報することはできません!')
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		if (user == client.user) {
			return interaction.reply({ content: '僕を通報しても意味ないよ。', ephemeral: true });
		}

		if (member) {
			if (member == interaction.member) {
				return interaction.reply({ content: '自分自身を通報していますよ...', ephemeral: true });
			}
			if (member.permissions.has('MANAGE_MESSAGES')) {
				const embed = new discord.MessageEmbed()
					.setDescription('❌ このコマンドでサーバー運営者を通報することはできません!')
					.setColor('RED');
				return interaction.reply({ embeds: [embed], ephemeral:true });
			}
		}

		const modal = new discord.Modal()
            .setCustomId('messageReport')
            .setTitle('メッセージを通報')
            .addComponents(
                new discord.MessageActionRow().addComponents(
                    new discord.TextInputComponent()
                        .setCustomId(interaction.targetMessage.id)
                        .setLabel('通報理由')
                        .setPlaceholder('通報はサーバー運営にのみ公開されます')
                        .setStyle('PARAGRAPH')
                        .setMaxLength(4000)
                        .setRequired(true),
                ),
            );
        interaction.showModal(modal);
    },

};