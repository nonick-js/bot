// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const { settingSwitcher } = require('../../../modules/switcher');
const { welcomeM_preview } = require('../../../modules/messageSyntax');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-Channel',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const customId = interaction.components[0].components[0].customId;
        const value = interaction.components[0].components[0].value;
        const embed = interaction.message.embeds[0];
        const button = interaction.message.components[1];

        const settingData = [
            { key: 'welcomeCh', model: 'welcomeM', embedIndex: 0, enableButtonModel: 'welcome', message: 'welcomeMessage' },
            { key: 'leaveCh', model: 'welcomeM', embedIndex: 1, enableButtonModel: 'leave', message: 'leaveMessage' },
            { key: 'reportCh', model: 'basic', embedIndex: 0, enableButtonModel: null, message: null },
            { key: 'logCh', model: 'log', embedIndex: 0, enableButtonModel: 'log', message: null },
        ];
        const setting = settingData.find(v => v.key == customId);
        const channel = interaction.guild.channels.cache.find(v => v.name == value);

        try {
            if (!channel) throw 'その名前のチャンネルはありません！\n(もしチャンネルが存在している場合は、チャンネルに何かしらの変更を加えてください)';
            if (!channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) { throw [
                `${channel}での**${interaction.client.user.username}**の権限が不足しています！`,
                '**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`',
            ].join('\n');}
        } catch (err) {
            const error = new discord.EmbedBuilder()
                .setDescription(`⚠️ ${err}`)
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        const Model = await require(`../../../models/${setting.model}`)(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

        let err = false;
        Model.update({ [setting.key]: channel.id }).catch(() => err = true);

        if (err) {
            const error = new discord.EmbedBuilder()
                .setDescription('❌ 設定を正しく保存できませんでした。時間を置いて再試行してください。')
                .setColor('Red');
            return interaction.update({ embeds: [embed, error] });
        }

        if (setting.enableButtonModel && !setting.message) {
            embed.fields[setting.embedIndex].value = settingSwitcher('STATUS_CH', Model.get(setting.enableButtonModel), channel.id);
            button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(false);
        }
        else if (setting.enableButtonModel && setting.message) {
            embed.fields[setting.embedIndex].value = settingSwitcher('STATUS_CH', Model.get(setting.enableButtonModel), channel.id) + `\n\n${discord.formatEmoji('966596708458983484')} ${welcomeM_preview(Model.get(setting.message))}`;
            button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(false);
        }
        else { embed.fields[setting.embedIndex].value = `${channel}`; }

        interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
    },
};
module.exports = [ ping_command ];