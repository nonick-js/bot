const fs = require('fs');
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
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {name: "ban", description: "ユーザーをBAN", type:'CHAT_INPUT', options: [
        {name: "user", description: "BAN 対象のユーザー(IDでも可能)", type: 'USER', required: true},
        {name: "delete_messages", description: "最近のメッセージ履歴をどこまで削除するか" , type: 'NUMBER', required: true, choices: [
            {name: '削除しない', value: 0},
            {name: '過去24時間', value: 1},
            {name: '過去7日', value: 7}
        ]},
        {name: "reason", description: 'BANする理由', type: 'STRING'}
    ]},
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
			const embed = new discord.MessageEmbed()
				.setColor('#E84136')
				.setDescription('あなたにはこのコマンドを使用する権限がありません！');
			return interaction.reply({embeds: [embed], ephemeral: true});
		}

        const moderateUserId = interaction.user.id;
        const banUserId = interaction.options.getUser('user').id;
        const banMember = interaction.guild.members.cache.get(banUserId);
        const banUserAvaterURL = interaction.options.getUser('user').displayAvatarURL();
        const banDeleteMessage = interaction.options.getNumber('delete_messages');
        let banReason = interaction.options.getString('reason');
        if (!banReason) banReason = '理由が入力されていません';

        if (banMember !== undefined) {
            if (interaction.member.roles.highest.comparePositionTo(banMember.roles.highest) !== 1) {
				const embed = new discord.MessageEmbed()
					.setDescription('自分より上の役職のメンバーをbanさせることはできません!')
					.setColor('RED')
				return interaction.reply({embeds: [embed], ephemeral: true});
			}
        }

        interaction.guild.members.ban(banUserId,{reason: banReason, days: banDeleteMessage})
            .then( async () => {
                const config = await Configs.findOne({where: {serverId: interaction.guild.id}});
                const banLog = config.get('banLog');
                const banDm = config.get('banDm');

                interaction.reply({content: `🔨 <@${banUserId}>(` + discord.Formatters.inlineCode(banUserId) + ')をBANしました。', ephemeral:true});
                if(banLog) {
                    const banLogCh = config.get('banidLogCh');
                    const embed = new discord.MessageEmbed()
                        .setTitle('🔨BAN')
                        .setThumbnail(banUserAvaterURL)
                        .addFields(
                            {name: '処罰を受けた人', value: `<@${banUserId}>(${banUserId})`},
                            {name: 'BANした理由', value: banReason, inline: true},
                            {name: '担当者', value: `<@${moderateUserId}>`}
                        )
                        .setColor('RED');
                    interaction.guild.channels.fetch(banLogCh)
                        .then((channel) => {
                            channel.send({embeds: [embed]})
                                .catch(() => {
                                    Configs.update({banidLog: false}, {where: {serverId: member.guild.id}});
                    		        Configs.update({banidLogCh: null}, {where: {serverId: member.guild.id}});
                                })
                        })
                        .catch(() => {
                            Configs.update({banidLog: false}, {where: {serverId: member.guild.id}});
                    		Configs.update({banidLogCh: null}, {where: {serverId: member.guild.id}});
                        });
				}
                if (banDm) {
					const banServerIcon = interaction.guild.iconURL();
					const embed = new discord.MessageEmbed()
						.setTitle('🛑BAN')
						.setDescription(`あなたは**${interaction.guild.name}**からBANされました`)
						.setThumbnail(banServerIcon)
						.setColor('RED')
						.addFields(
							{name: 'BANされた理由', value: banReason}
					);
					interaction.options.getUser('user').send({embeds: [embed]})
						.catch(() => {
							const embed = new discord.MessageEmbed()
								.setDescription('BANした人への警告DMに失敗しました。\nフレンド以外からのメッセージ受信を拒否しています。')
								.setColor('RED')
							interaction.followUp({embeds: [embed], ephemeral: true});
						});
				}
			})
			.catch(() => {
				const embed = new discord.MessageEmbed()
					.setDescription(`<@${banUserId}>(` + discord.Formatters.inlineCode(banUserId) + `)のBANに失敗しました。\nBOTより上の権限を持っているか、サーバーの管理者です。`)
					.setColor('RED');
				interaction.reply({embeds: [embed], ephemeral:true});
			});
    }
}