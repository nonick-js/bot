const discord = require('discord.js');

/**
* @callback InteractionCallback
* @param {discord.CommandInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: {
        name: 'welcomesetting',
        description: '入退室ログの設定',
        type: 'CHAT_INPUT',
        options: [
            { name: 'welcome', description: '入室ログを 有効/無効 にする', type: 'BOOLEAN' },
            { name: 'welcomech', description: '入室ログを送信するチャンネル', type: 'CHANNEL' },
            { name: 'welcomemessage', description: '入室ログに埋め込むメッセージ', type: 'STRING' },
            { name: 'leave', description: '退室ログを 有効/無効 にする', type: 'BOOLEAN' },
            { name: 'leavech', description: '退室ログを送信するチャンネル', type: 'CHANNEL' },
        ],
    },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs) => {
        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            const embed = new discord.MessageEmbed()
                .setColor('RED')
                .setDescription([
                    '❌ **あなたにはこれを実行する権限がありません！**',
                    '必要な権限: `サーバー管理`',
                ].join('\n'));
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const i_welcome = interaction.options.getBoolean('welcome');
        const i_welcomeCh = interaction.options.getChannel('welcomech');
        const i_welcomeMessage = interaction.options.getString('welcomemessage');
        const i_leave = interaction.options.getBoolean('leave');
        const i_leaveCh = interaction.options.getChannel('leavech');

        const result = new Array(3);

        if (i_welcomeCh !== null) {
            if (i_welcomeCh.type == 'GUILD_STAGE_VOICE' || i_welcomeCh.type == 'GUILD_CATEGORY') {
                result[1] = '⚠️ **送信先**: 指定したチャンネルは無効なチャンネルです';
            } else {
                const successembed = new discord.MessageEmbed()
                    .setDescription('✅ **入室ログ**がここに送信されます!')
                    .setColor('GREEN');
                i_welcomeCh.send({ embeds: [successembed] })
                    .then(() => {
                        Configs.update({ welcomeCh: i_welcomeCh.id }, { where: { serverId: interaction.guildId } });
                    })
                    .catch(result[1] = '⚠️ **送信先**: 指定したチャンネルの権限がありません');
            }
        }
        if (i_welcome !== null) {
            const config_now = await Configs.findOne({ where: { serverId: interaction.guild.id } });
            const welcomeCh = config_now.get('welcomeCh');
            result[0] = welcomeCh == null ? '❌ **入室ログ**: チャンネルが指定されていません' : '';
            Configs.update({ welcome: i_welcome }, { where: { serverId: interaction.guild.id } });
        }
        if (i_welcomeMessage !== null) {
            Configs.update({ welcomeMessage: i_welcomeMessage }, { where: { serverId: interaction.guild.id } });
        }
        if (i_leaveCh !== null) {
            if (i_leaveCh.type == 'GUILD_STAGE_VOICE' || i_leaveCh.type == 'GUILD_CATEGORY') {
                result[3] = '❌ **送信先**: 指定したチャンネルは無効なチャンネルです';
            } else {
                const successembed = new discord.MessageEmbed()
                    .setDescription('✅ **退室ログ**がここに送信されます!')
                    .setColor('GREEN');
                i_leaveCh.send({ embeds: [successembed] })
                    .then(() => {
                        result[3] = `✅ **送信先**: ${discord.Formatters.channelMention(i_leaveCh)}`;
                        Configs.update({ leaveCh: i_leaveCh.id }, { where: { serverId: interaction.guildId } });
                    })
                    .catch(() => {
                        result[3] = '⚠️ **送信先**: 指定したチャンネルの権限がありません';
                    });
            }
            Configs.update({ leaveCh: i_leaveCh.id }, { where: { serverId: interaction.guildId } });
        }
        if (i_leave !== null) {
            const config_now = await Configs.findOne({ where: { serverId: interaction.guildId } });
            const leaveCh = config_now.get('leaveCh');
            result[2] = leaveCh == null ? '⚠️ **退室ログ**: チャンネルが指定されていません' : i_leave ? '✅ **有効**' : '✅ **無効**';
            Configs.update({ leave: i_leave }, { where: { serverId: interaction.guildId } });
        }

        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const welcome = config.get('welcome');
        const welcomeCh = config.get('welcomeCh');
        const welcomeMessage = config.get('welcomeMessage');
        const leave = config.get('leave');
        const leaveCh = config.get('leaveCh');

        const embed = new discord.MessageEmbed()
            .setTitle('🛠️ 設定変更')
            .setDescription('入退室ログの設定を変更しました!')
            .setColor('GREEN')
            .addFields([
                
            ]
            );
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};