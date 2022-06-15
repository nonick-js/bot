const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.ModalSubmitInteraction} interaction
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
    data: { customid: 'messageReport', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const reportRoleMention = config.get('reportRoleMention');
        const reportCh = config.get('reportCh');
        const reportRole = config.get('reportRole');

        const embed = interaction.message.embeds[0];
        const user = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''));
        const channel = embed.fields[1].value;
        const reportUser = interaction.user;
        const reportReason = interaction.fields.getTextInputValue('firstTextInput');

        const reportEmbed = new discord.MessageEmbed()
            .setTitle('⚠ 通報 (メッセージ)')
            .setDescription(discord.Formatters.codeBlock(`${reportReason}`))
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '投稿者', value: `${user}`, inline:true },
                { name: '投稿先', value: `${channel}`, inline:true },
            )
            .setColor('RED')
            .setFooter({ text: `通報者: ${reportUser.tag}`, iconURL: reportUser.displayAvatarURL() });
        if (embed.fields[2].value) reportEmbed.addFields({ name: 'メッセージ', value: `${embed.fields[2].value}` });
        if (embed.image) reportEmbed.setImage(embed.image.url);

        interaction.member.guild.channels.fetch(reportCh)
            .then(reportchannel => {
                const content = reportRoleMention ? `<@&${reportRole}>` : ' ';
                reportchannel.send({ content: content, embeds: [reportEmbed] })
                    .then(() => {
                        interaction.update({ content: '✅ **報告ありがとうございます!** 通報をサーバー運営に送信しました!', embeds: [], components: [], ephemeral:true });
                    })
                    .catch(() => {
                        Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                        interaction.update({ content: '❌ 通報の送信中に問題が発生しました。', embeds: [], components: [], ephemeral:true });
                    });
            })
            .catch(() => {
                Configs.update({ reportCh: null }, { where: { serverId: interaction.guildId } });
                interaction.update({ content: '❌ 通報の送信中に問題が発生しました。', embeds: [], components: [], ephemeral:true });
            });
    },
};