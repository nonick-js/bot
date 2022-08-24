const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.ModalSubmitInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { customid: 'messageReport', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs) => {

        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const { reportRole, reportRoleMention, reportCh } = config.get();

        const messageId = interaction.components[0].components[0].customId;
        const reportReason = interaction.components[0].components[0].value;

        /** @type {discord.Message} */
        // eslint-disable-next-line no-empty-function
        const message = await interaction.channel.messages.fetch(messageId).catch(() => {});
        if (!message) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ 通報しようとしているメッセージは削除されました。')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.MessageEmbed()
            .setTitle('⚠️ 通報 (メッセージ)')
            .setDescription(`\`\`\`${reportReason}\`\`\``)
            .addFields(
                { name: '投稿者', value: `${message.author}`, inline:true },
                { name: '投稿先', value: `${message.channel} [リンク](${message.url})`, inline:true },
            )
            .setColor('RED')
            .setThumbnail(message.author.displayAvatarURL())
            .setFooter({ text: `通報者: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

        if (message.content) embed.addFields({ name: 'メッセージ', value: `${message.content}` });
		if (message.attachments.first()) {
			const reportedMessageFile = message.attachments.first();
			if (reportedMessageFile.height && reportedMessageFile.width) embed.setImage(reportedMessageFile.url);
		}

        // eslint-disable-next-line no-empty-function
        const Ch = await interaction.guild.channels.fetch(reportCh).catch(() => {});
        if (!Ch) {
            Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
            return interaction.reply({ content: '❌ 通報の送信中に問題が発生しました。', ephemeral: true });
        }

        const content = reportRoleMention ? `<@&${reportRole}>` : ' ';

        Ch.send({ content: content, embeds: [embed] })
            .then(() => {
                interaction.reply({ content: '✅ **報告ありがとうございます!** 通報をサーバー運営に送信しました!', ephemeral: true });
            })
            .catch(() => {
                Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                interaction.reply({ content: '❌ 通報の送信中に問題が発生しました。', ephemeral: true });
            });
    },
};