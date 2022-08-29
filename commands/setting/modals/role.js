// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
// 埋め込みのFieldのname, 対応したON/OFFの設定, 対応したON/OFFのボタンの場所
const fieldIndex = {
    reportRole: [1, 'reportRoleMention', 1],
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const ping_command = {
    data: {
        customId: 'setting-Role',
        type: 'MODAL',
    },
    exec: async (interaction) => {
        const setting = interaction.components[0].components[0].customId;
        const textInput = interaction.components[0].components[0].value;

        /** @type {discord.EmbedBuilder} */
        const embed = interaction.message.embeds[0];
        /** @type {discord.ActionRow} */
        const select = interaction.message.components[0];
        /** @type {discord.ActionRow} */
        const button = interaction.message.components[1];

        const config = await interaction.db_config.findOne({ where: { serverId: interaction.guildId } });

        const role = interaction.guild.roles.cache.find(v => v.name == textInput);
        if (!role) {
            const roleNotFound = new discord.MessageEmbed()
                .setDescription(`⚠️ ${discord.inlineCode(textInput)}という名前のロールは存在しません！`)
                .setColor('RED');
            return interaction.update({ embeds: [embed, roleNotFound] });
        }

        interaction.db_config.update({ [setting]: role.id }, { where: { serverId: interaction.guildId } });
        if (config.get(fieldIndex[setting][1])) embed.fields[fieldIndex[setting][0]].value = `${discord.formatEmoji('758380151544217670')} 有効 (<@&${role.id}>)`;
        button.components[fieldIndex[setting][2]] = discord.ButtonBuilder.from(button.components[fieldIndex[setting][2]]).setDisabled(false);

        interaction.update({ embeds: [embed], components: [select, button] });
    },
};
module.exports = [ ping_command ];