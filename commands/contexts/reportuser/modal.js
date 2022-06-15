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
    data: { customid: 'userReport', type: 'MODAL' },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        const config = await Configs.findOne({ where: { serverId: interaction.guildId } });
        const reportRoleMention = config.get('reportRoleMention');
        const reportCh = config.get('reportCh');
        const reportRole = config.get('reportRole');

        const embed = interaction.message.embeds[0];
        const user = await client.users.fetch(embed.fields[0].value.replace(/^../g, '').replace(/.$/, ''));
        const reportUser = interaction.user;
        const reportReason = interaction.fields.getTextInputValue('firstTextInput');

        const reportEmbed = new discord.MessageEmbed()
            .setTitle('⚠ 通報 (メンバー)')
            .setDescription(`通報者: ${reportUser}\n` + discord.Formatters.codeBlock(`${reportReason}`))
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '対象者', value: `${user}`, inline:true },
            )
            .setFooter({ text: `通報者: ${reportUser.tag}`, iconURL: reportUser.displayAvatarURL() })
            .setColor('RED');

        interaction.member.guild.channels.fetch(reportCh)
            .then(channel => {
                const content = reportRoleMention ? `<@&${reportRole}>` : ' ';
                channel.send({ content: content, embeds: [reportEmbed] })
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