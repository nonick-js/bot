// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
// 埋め込みのFieldのname, 対応したON/OFFの設定, 対応したON/OFFのボタンの場所
const fieldIndex = {
    welcomeCh: [0, 'welcome', 1],
    reportCh: [0, 'report', 1],
    leaveCh: [1, 'leave', 1],
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-Channel',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const setting = interaction.components[0].components[0].customId;
        const textInput = interaction.components[0].components[0].value;
        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });

        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        const ch = interaction.guild.channels.cache.find(v => v.name == textInput);
        if (!ch) {
            const error = new discord.EmbedBuilder()
                .setDescription(`⚠️ \`${textInput}\`という名前のチャンネルは存在しません！`)
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        const successEmbed = new discord.EmbedBuilder()
            .setDescription(`✅ **${embed.fields[fieldIndex[setting][0]].name}**がここに送信されます！`)
            .setColor('Green');

        ch.send({ embeds: [successEmbed] })
            .then(() => {
                interaction.db_config.update({ [setting]: ch.id }, { where: { serverId: interaction.guildId } });
                if (setting == 'reportCh') {
                    embed.fields[fieldIndex[setting][0]].value = `<#${ch.id}>`;
                } else {
                    if (config.get(fieldIndex[setting][1])) embed.fields[fieldIndex[setting][0]].value = `${discord.formatEmoji('758380151544217670')} 有効 (<#${ch.id}>)`;
                    button.components[fieldIndex[setting][2]] = discord.ButtonBuilder.from(button.components[fieldIndex[setting][2]]).setDisabled(false);
                }

                interaction.update({ embeds: [embed], components: [select, button] });
            })
            .catch((e) => {
                console.log(e);
                const MissingPermission = new discord.EmbedBuilder()
                    .setDescription('⚠️ **BOTの権限が不足しています！**\n必要な権限: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`')
                    .setColor('Red');

                interaction.update({ embeds: [embed, MissingPermission] });
            });
    },
};
module.exports = [ ping_command ];