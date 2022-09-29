const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { textChannelCheck } = require('../../../../modules/valueCheck');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-reportCh',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new discord.ModalBuilder()
      .setCustomId('setting-reportCh-modal')
      .setTitle('通報の送信先')
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('name')
            .setLabel('チャンネル名')
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
    customId: 'setting-reportCh-modal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];

    const name = interaction.fields.getTextInputValue('name');
    const channel = interaction.guild.channels.cache.find(v => v.name === name);

    await textChannelCheck(channel, interaction);
    if (interaction.replied) return;

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.report.channel = channel.id;
		await Config.save({ wtimeout: 3000 });

    embed.fields[0].value = discord.channelMention(Config.report.channel);
    interaction.update({ embeds: [embed], components: [interaction.message.components[0], interaction.message.components[1]] });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];