const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {discord.Client} client
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'ban', description: 'ユーザーをBAN', type:'CHAT_INPUT', options: [
        { name: 'user', description: 'BAN 対象のユーザー(IDでも可能)', type: 'USER', required: true },
        { name: 'delete_messages', description: '最近のメッセージ履歴をどこまで削除するか', type: 'NUMBER', required: true, choices: [
            { name: '削除しない', value: 0 },
            { name: '過去24時間', value: 1 },
            { name: '過去7日', value: 7 },
        ] },
        { name: 'reason', description: 'BANする理由', type: 'STRING' },
    ] },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
			const embed = new discord.MessageEmbed()
                .setDescription([
                    '❌ あなたにはこのコマンドを使用する権限がありません！',
                    '必要な権限: `メンバーをBAN`',
                ].join('\n'))
                .setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}

		/** コマンドを実行したユーザー */
        const moderateUser = interaction.user;
		/** BAN対象のユーザー */
        const banUser = interaction.options.getUser('user');
		/** BAN対象のメンバー */
        const banMember = interaction.guild.members.cache.get(banUser.id);

        const banDeleteMessage = interaction.options.getNumber('delete_messages');
        const banReason = interaction.options.getString('reason') ? interaction.options.getString('reason') : '理由が入力されていません' ;

        if (banMember && moderateUser.id !== interaction.guild.ownerId && interaction.member.roles.highest.comparePositionTo(banMember.roles.highest) !== 1) {
            const embed = new discord.MessageEmbed()
				.setDescription('❌ 最上位の役職が自分より上か同じメンバーをBANさせることはできません!')
				.setColor('RED');
			return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (banUser == moderateUser) return interaction.reply({ content: '自分自身をBANするの!?', ephemeral:true });
        if (banUser == client.user) return interaction.reply({ content: '僕をBAN...? 自滅しろってのか!?', ephemeral: true });

        interaction.guild.members.ban(banUser.id, { reason: banReason, days: banDeleteMessage })
            .then(async () => {
                const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
                const banLog = config.get('banLog');
                const banDm = config.get('banDm');

                interaction.reply({ content: `🔨 <@${banUser.id}>(${discord.Formatters.inlineCode(banUser.id)})をBANしました。`, ephemeral:true });
                if (banLog) {
                    const banLogCh = config.get('banLogCh');
                    const embed = new discord.MessageEmbed()
                        .setTitle('🔨BAN')
                        .setThumbnail(banUser.displayAvatarURL())
                        .addFields(
                            { name: '処罰を受けた人', value: `<@${banUser.id}>(${discord.Formatters.inlineCode(banUser.id)})` },
                            { name: 'BANした理由', value: banReason },
                        )
                        .setFooter({ text: `担当者: ${moderateUser.tag}`, iconURL: moderateUser.displayAvatarURL() })
                        .setColor('RED');
                    interaction.guild.channels.fetch(banLogCh)
                        .then((channel) => {
                            channel.send({ embeds: [embed] }).catch(() => {
                                Configs.update({ banidLog: false }, { where: { serverId: interaction.guild.id } });
                                Configs.update({ banidLogCh: null }, { where: { serverId: interaction.guild.id } });
                            });
                        }).catch(() => {
                            Configs.update({ banidLog: false }, { where: { serverId: interaction.guild.id } });
                            Configs.update({ banidLogCh: null }, { where: { serverId: interaction.guild.id } });
                        });
				}
                if (banDm) {
					const embed = new discord.MessageEmbed()
						.setTitle('🔨BAN')
						.setDescription([
                            `あなたは**${interaction.guild.name}**からBANされました`,
                            '**BANされた理由**',
                            banReason,
                        ].join('\n'))
						.setThumbnail(interaction.guild.iconURL())
						.setColor('RED');
					banUser.send({ embeds: [embed] }).catch(() => {
                        const permissionError = new discord.MessageEmbed()
                            .setDescription('⚠️ BANした人への警告DMに失敗しました。\nメッセージ受信を拒否しています。')
                            .setColor('RED');
                        interaction.followUp({ embeds: [permissionError], ephemeral: true });
                    });
				}
			}).catch(() => {
				const embed = new discord.MessageEmbed()
					.setDescription([
                        `❌ <@${banUser.id}>(${discord.Formatters.inlineCode(banUser.id)})のBANに失敗しました。`,
                        'BOTより上の権限を持っているか、サーバーの管理者です。',
                    ].join('\n'))
					.setColor('RED');
				interaction.reply({ embeds: [embed], ephemeral:true });
			});
    },
};