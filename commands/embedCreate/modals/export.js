// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'embed-exportModal',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const date = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' }).replace(/[^0-9]/g, '');
        const embedData = interaction.message.embeds[0].toJSON();
        delete embedData.type;

        const file = new discord.AttachmentBuilder()
            .setName((interaction.fields.getTextInputValue('name') || `embed_${interaction.guildId}-${date}`) + '.json')
            .setFile(Buffer.from(JSON.stringify(embedData, null, 2)));

        interaction.followUp({ content: '✅ 現在の埋め込みの状態をエクスポートしました。`/embed import`で読み込ませることができます。', files: [file] })
            .catch((err) => {
                const embed = new discord.EmbedBuilder()
                    .setDescription(`❌ ファイル生成時にエラーが発生しました。再度お試し下さい。\n\`\`\`${err}\`\`\``)
                    .setColor('Red');
                interaction.followUp({ embeds: [embed], ephemeral: true });
            });
    },
};
module.exports = [ ping_command ];