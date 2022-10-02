const discord = require('discord.js');
const { memberRoleCheck } = require('../../../modules/valueCheck');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole-deleteRole',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const select = interaction.message.components[0];
    const button = interaction.message.components[1];

    if (select.components[0].type == discord.ComponentType.Button) {
      const error = new discord.EmbedBuilder()
				.setAuthor({ name: 'まだ一つもロールを追加していません！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.update({ embeds: [interaction.message.embeds[0], error] });
    }

    if (select.components[0].options.length == 1) return interaction.update({ embeds: [interaction.message.embeds[0]], components: [button] });

    const modal = new discord.ModalBuilder()
      .setCustomId('reactionRole-deleteRoleModal')
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
		customId: 'reactionRole-deleteRoleModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const select = interaction.message.components[0];
		const button = interaction.message.components[1];
    const options = select.components[0].options;

		const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('name'));

		await memberRoleCheck(role, interaction);
		if (interaction.replied) return;

		select.components[0] = discord.SelectMenuBuilder.from(select.components[0]).setOptions(options.filter(v => v.value !== role.id));
		interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
	},
};

module.exports = [ buttonInteraction, modalInteraction ];