const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { memberRoleCheck } = require('../../../../modules/valueCheck');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-reportRole',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new discord.ModalBuilder()
      .setCustomId('setting-reportRole-modal')
      .setTitle('ロールメンション')
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('name')
            .setLabel('ロールの名前')
            .setMaxLength(100)
            .setStyle(discord.TextInputStyle.Short)
            .setRequired(true),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'setting-reportRole-modal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];

    const name = interaction.fields.getTextInputValue('name');
    const role = interaction.guild.roles.cache.find(v => v.name === name);

    await memberRoleCheck(role, interaction);
    if (interaction.replied) return;

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.report.mentionRole = role.id;
		await Config.save({ wtimeout: 1500 });

    embed.fields[1].value = settingSwitcher('STATUS_ROLE', Config.report.mention, Config.report.mentionRole);
    button.components[1] = discord.ButtonBuilder.from(button.components[1]).setDisabled(false);

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];