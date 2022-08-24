const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: '緊急タイムアウト', type: 'USER' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {

        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) {
            const embed = new discord.MessageEmbed()
				.setDescription([
					'❌ あなたにはこのコマンドを使用する権限がありません！',
					'必要な権限: `メンバーをタイムアウト`',
				].join('\n'))
				.setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const { timeoutLogCh } = config.get();

        if (!interaction.targetMember) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ このユーザーはサーバーにいません!')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        interaction.targetMember.timeout(2419000000, `緊急タイムアウト by ${interaction.user.tag}`)
            .then(() => {
                interaction.reply({ content: `⛔ ${interaction.targetUser}を**緊急タイムアウト**しました (28日)` });

                const embed = new discord.MessageEmbed()
                    .setTitle('⚠️緊急タイムアウト')
                    .setThumbnail(interaction.targetUser.displayAvatarURL())
                    .setDescription(`${interaction.targetUser}を**緊急タイムアウト**しました (28日)`)
                    .setColor('RED')
                    .setFooter({ text: `担当者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });
                interaction.guild.channels.fetch(timeoutLogCh)
                    .then(channel => channel.send({ embeds: [embed] }).catch(e => console.log(e)))
                    .catch(e => console.log(e));
            })
            .catch(() => {
				const embed = new discord.MessageEmbed()
					.setDescription([
                        `❌ <@${interaction.targetMember.id}>(\`${interaction.targetMember.id}\`)のタイムアウトに失敗しました。`,
                        'BOTより上の権限を持っているか、サーバーの管理者です。',
                    ].join('\n'))
					.setColor('RED');
				interaction.reply({ embeds: [embed], ephemeral:true });
			});
    },
};