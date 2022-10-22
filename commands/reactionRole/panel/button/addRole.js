const discord = require('discord.js');
const { memberRoleCheck } = require('../../../../modules/valueCheck');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole_button-addRole',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new discord.ModalBuilder()
      .setCustomId('reactionRole_button-addRoleModal')
      .setTitle('ロールを追加')
      .setComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('name')
            .setLabel('ロールの名前')
            .setMaxLength(100)
            .setStyle(discord.TextInputStyle.Short),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'reactionRole_button-addRoleModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[0];
    const roles = embed.fields[0].value.split(' ');

    const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('name'));

    await memberRoleCheck(role, interaction);
    if (interaction.replied) return;

    if (roles.includes(`<@&${role.id}>`)) {
      const errorEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: 'そのロールは既に追加されています！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.update({ embeds: [embed, errorEmbed] });
    }

    roles.push(`<@&${role.id}>`);
    if (roles[0] == '`なし`') roles.shift();

    const editEmbed = discord.EmbedBuilder.from(embed).setFields({ name: embed.fields[0].name, value: roles.join(' ') });
    button.components[2] = discord.ButtonBuilder.from(button.components[2]).setDisabled(false);
    button.components[4] = discord.ButtonBuilder.from(button.components[4]).setDisabled(false);
    button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(roles.length >= 5);

    interaction.update({ embeds: [editEmbed], components: [button] });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];