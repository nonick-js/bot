const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Colors } = require('discord.js');

const ReportReactionButtons = new ActionRowBuilder().setComponents(
  new ButtonBuilder()
    .setCustomId('nonick-js:report-completed')
    .setLabel('対処済み')
    .setStyle(ButtonStyle.Success),
  new ButtonBuilder()
    .setCustomId('nonick-js:report-ignore')
    .setLabel('無視')
    .setStyle(ButtonStyle.Danger),
);

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const completedButtonInteraction = {
  data: {
    customId: 'nonick-js:report-completed',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new ModalBuilder()
      .setCustomId('nonick-js:report-completedModal')
      .setTitle('対処済みとしてマーク')
      .setComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('action')
            .setLabel('行った対処・処罰')
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const completedModalInteraction = {
  data: {
    customId: 'nonick-js:report-completedModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const action = interaction.fields.getTextInputValue('action');

    const newEmbed = EmbedBuilder.from(embed)
      .setTitle('対処済み')
      .setColor(Colors.Green)
      .setFooter({
        text: `by ${interaction.user.tag} ・ ${action}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    interaction.update({ embeds: [newEmbed], components: [] });
  },
};

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const ignoreButtonInteraction = {
  data: {
    customId: 'nonick-js:report-ignore',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new ModalBuilder()
      .setCustomId('nonick-js:report-ignoreModal')
      .setTitle('対処なしとしてマーク')
      .setComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('reason')
            .setLabel('理由')
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const ignoreModalInteraction = {
  data: {
    customId: 'nonick-js:report-ignoreModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
    const reason = interaction.fields.getTextInputValue('reason');

    const newEmbed = EmbedBuilder.from(embed)
      .setTitle('対処無し')
      .setColor(Colors.Red)
      .setFooter({
        text: `by ${interaction.user.tag} ・ ${reason}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    interaction.update({ embeds: [newEmbed], components: [] });
  },
};

module.exports = [
  ReportReactionButtons,
  completedButtonInteraction,
  completedModalInteraction,
  ignoreButtonInteraction,
  ignoreModalInteraction,
];