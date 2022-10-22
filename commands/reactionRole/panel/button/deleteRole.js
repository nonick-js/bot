const discord = require('discord.js');
const { memberRoleCheck } = require('../../../../modules/valueCheck');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole_button-deleteRole',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[0];
    const roles = embed.fields[0].value.split(' ');

    if (roles.length == 1) {
      const editEmbed = discord.EmbedBuilder.from(embed).setFields({ name: embed.fields[0].name, value: '`なし`' });
      button.components[2] = discord.ButtonBuilder.from(button.components[2]).setDisabled(true);
      button.components[3] = discord.ButtonBuilder.from(button.components[3]).setDisabled(true);

      return interaction.update({ embeds: [editEmbed], components: [button] });
    }

    const modal = new discord.ModalBuilder()
      .setCustomId('reactionRole_button-deleteRoleModal')
      .setTitle('ロール削除')
      .addComponents(
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
    customId: 'reactionRole_button-deleteRoleModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const roles = embed.fields[0].value.split(' ');

    const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('name'));

		await memberRoleCheck(role, interaction);
		if (interaction.replied) return;

    const editEmbed = discord.EmbedBuilder.from(embed).setFields({ name: embed.fields[0].name, value: roles.filter(v => v !== `<@&${role.id}>`).join(' ') });

    interaction.update({ embeds: [editEmbed] });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];