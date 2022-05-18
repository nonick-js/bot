const fs = require('fs');
const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.MessageContextMenuInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /**@type {discord.ApplicationCommandData|ContextMenuData} */
    data: {
        name: "welcomesetting",
        description: "入退室ログの設定",
        type: "CHAT_INPUT",
        options: [
            {name: "welcome", description: "入室ログ", type: "BOOLEAN"},
            {name: "welcomech", description: "入室ログを送信するチャンネル", type: "CHANNEL"},
            {name: "welcomemessage", description: "入室ログに埋め込むメッセージ", type: "STRING"},
            {name: "leave", description: "退室ログ", type: "BOOLEAN"},
            {name: "leavech", description: "退室ログを送信するチャンネル", type: "CHANNEL"},
        ]
    },
    /**@type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
		const config = await Configs.findOne({where: {serverId: interaction.guild.id}});

        const i_welcome = interaction.options.getBoolean('welcome');
        const i_welcomeCh = interaction.options.getChannel('welcomech');
        const i_welcomeMessage = interaction.options.getString('welcomemessage');
        const i_leave = interaction.options.getBoolean('leave');
        const i_leaveCh = interaction.options.getChannel('leavech');

        if (i_welcomeMessage !== null) {Configs.update({welcomeMessage: i_welcomeMessage}, {where: {serverId: interaction.guild.id}});}
        if (i_leaveCh !== null ) {Configs.update({leaveCh: i_leaveCh.id}, {where: {serverId: interaction.guild.id}});}
        if (i_welcomeCh !== null) {Configs.update({welcomeCh: i_welcomeCh.id}, {where: {serverId: interaction.guild.id}});}
        if (i_welcome !== null) {
		    const config_re = await Configs.findOne({where: {serverId: interaction.guild.id}});
            const welcomeCh = config_re.get('welcomeCh');
            if (welcomeCh == null) {
                const embed = new discord.MessageEmbed()
                    .setDescription('⚠ 入室ログを設定するチャンネルが指定されていません!')
                    .setColor('RED');
                return interaction.reply({embeds: [embed], ephemeral: true});
            }
            Configs.update({welcome: i_welcome}, {where: {serverId: interaction.guild.id}});
        }
        if (i_leave !== null) {
		    const config_re = await Configs.findOne({where: {serverId: interaction.guild.id}});
            const leaveCh = config_re.get('leaveCh');
            if (leaveCh == null) {
                const embed = new discord.MessageEmbed()
                    .setDescription('⚠ 退室ログを設定するチャンネルが指定されていません!')
                    .setColor('RED');
                return interaction.reply({embeds: [embed], ephemeral: true});
            }
            Configs.update({leave: i_leave}, {where: {serverId: interaction.guild.id}});
        }

        const welcome = config.get('welcome');
        const welcomeCh = config.get('welcomeCh');
        const welcomeMessage = config.get('welcomeMessage');
        const leave = config.get('leave');
        const leaveCh = config.get('leaveCh');

        const embed = new discord.MessageEmbed()
            .setTitle('設定を更新しました!')
            .setColor('GREEN')
            .addFields(
                {name: '入室ログ', value: discord.Formatters.formatEmoji('758380151544217670')+' 有効化中 '+'('+discord.Formatters.channelMention(welcomeCh)+')', inline:true},
                {name: '退室ログ', value: discord.Formatters.formatEmoji('758380151544217670')+' 有効化中 '+'('+discord.Formatters.channelMention(leaveCh)+')', inline:true},
                {name: 'メッセージ', value: welcomeMessage}                
            )
        if (!welcome) {embed.spliceFields(0, 1, {name: '入室ログ', value: discord.Formatters.formatEmoji('758380151238033419')+' 無効化中', inline:true});}
        if (!leave) {embed.spliceFields(1, 1, {name: '退室ログ', value: discord.Formatters.formatEmoji('758380151238033419')+' 無効化中', inline:true});}
        interaction.reply({embeds: [embed], ephemeral: true});
    }
}