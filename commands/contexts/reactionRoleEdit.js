// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').MessageRegister} */
const ping_command = {
    data: {
        name: 'パネルの編集',
        dmPermission: false,
        defaultMemberPermissions: discord.PermissionFlagsBits.ManageRoles | discord.PermissionFlagsBits.ManageMessages,
        type: 'MESSAGE',
    },
    exec: async (interaction) => {
        const message = interaction.targetMessage;
        /** @type {discord.Embed} */
        const panelEmbed = message.embeds[0];
        /** @type {discord.SelectMenuComponent} */
        const components = message.components[0].components[0];

        if (message.author !== interaction.client.user || components?.type !== discord.ComponentType.SelectMenu || components?.customId !== 'reactionRole') {
            const embed = new discord.EmbedBuilder()
                .setDescription('❌ それはリアクションロールパネルではありません!')
                .setColor('Red');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new discord.EmbedBuilder()
            .setTitle(panelEmbed.title)
            .setDescription(panelEmbed.description)
            .setColor(panelEmbed.color)
            .setImage(panelEmbed.image?.url)
            .setFooter({ text: `${message.id}`, iconURL: 'https://media.discordapp.net/attachments/958791423161954445/1003671818881740891/988439788132646954.png' });

        const button = new discord.ActionRowBuilder().addComponents(
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-EditEmbed')
                .setEmoji('988439788132646954')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-AddRole')
                .setLabel('追加')
                .setEmoji('988439798324817930')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-DeleteRole')
                .setLabel('削除')
                .setEmoji('989089271275204608')
                .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-Mode')
                .setLabel('単一選択')
                .setStyle(discord.ButtonStyle.Success),
            new discord.ButtonBuilder()
                .setCustomId('reactionRole-OverWrite')
                .setLabel('編集')
                .setStyle(discord.ButtonStyle.Primary),
        );

        interaction.reply({ content: '**プレビューモード**\n「編集」ボタンを押すとパネルの編集を終了します。', embeds: [embed], components: [message.components[0], button], ephemeral: true });
    },
};
module.exports = [ ping_command ];