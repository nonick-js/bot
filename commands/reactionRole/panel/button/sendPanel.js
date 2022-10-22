const discord = require('discord.js');
const FeatureData = require('../../../../schemas/featureDataSchema');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole_button-sendPanel',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    await interaction.deferUpdate();

    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[0];

    const regexp = new RegExp(/(?<=<@&)\d+(?=>)/);

    const roles = await Promise.all(embed.fields[0].value.split(' ').map(v => interaction.guild.roles.fetch(v.match(regexp)[0]).catch(() => {})));
    const reactionButton = new discord.ActionRowBuilder();

    roles.filter(Boolean).forEach(async (v) => {
      reactionButton.addComponents(
        new discord.ButtonBuilder()
          .setCustomId(v.id)
          .setLabel(v.name)
          .setStyle(button.components[3].style),
      );
    });

    if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(discord.PermissionFlagsBits.ViewChannel | discord.PermissionFlagsBits.SendMessages | discord.PermissionFlagsBits.EmbedLinks)) {
      const errorEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: `#${interaction.channel} での ${interaction.client.user.username} の権限が不足しています！`, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setDescription('**必要な権限**: `チャンネルを見る` `メッセージを送信` `埋め込みリンク`')
        .setColor('Red');
      return interaction.editReply({ embeds: [embed, errorEmbed] });
    }

    const panelEmbed = discord.EmbedBuilder.from(embed).setFields();

    interaction.channel.send({ embeds: [panelEmbed], components: [reactionButton] })
      .then(async (message) => {
        const success = new discord.EmbedBuilder()
          .setDescription('✅ パネルを作成しました!')
          .setColor('Green');
        interaction.editReply({ content: ' ', embeds: [success], components:[] });

        const res = await FeatureData.findOneAndUpdate(
          { serverId: interaction.guildId },
          { $push: { 'reactionRole.button.messages': { channelId: message.channelId, messageId: message.id } }, $setOnInsert: { serverId: interaction.guildId } },
          { upsert: true, new: true },
        );
        res.save({ wtimeout: 1500 });
      })
      .catch((err) => {
        const error = new discord.EmbedBuilder()
          .setAuthor({ name: 'エラー！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
          .setDescription(`以下のエラー文を直前の動作と共にサポートサーバーへ送信してください。\n\`\`\`${err}\`\`\``)
          .setColor('Red');
        interaction.editReply({ embeds: [interaction.message.embeds[0], error] });
      });
  },
};

module.exports = [ buttonInteraction ];