// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const ping_command = {
    data: {
        customId: 'setting-welcomeMessage',
        type: 'BUTTON',
    },
    exec: async (interaction) => {
        const Model = await require('../../../../models/welcomeM')(interaction.sequelize).findOne({ where: { serverId: interaction.guildId } });

        const modal = new discord.ModalBuilder()
            .setCustomId('setting-Message')
            .setTitle('入室ログメッセージ')
            .addComponents(
                new discord.ActionRowBuilder().addComponents(
                    new discord.TextInputBuilder()
                        .setCustomId('welcomeMessage')
                        .setLabel('入室ログに表示するメッセージ')
                        .setPlaceholder('各テキストのマークアップは公式ドキュメントを参照してください')
                        .setMaxLength(3000)
                        .setValue(Model.get('welcomeMessage'))
                        .setStyle(discord.TextInputStyle.Paragraph)
                        .setRequired(true),
                ),
            );

        interaction.showModal(modal);
    },
};
module.exports = [ ping_command ];