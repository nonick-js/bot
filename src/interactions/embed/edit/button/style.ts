import { Button } from '@akki256/discord-interaction';
import { ActionRowBuilder, ButtonBuilder } from 'discord.js';

const changeStyle = new Button(
  { customId: 'nonick-js:embedMaker-roleButton-changeStyle' },
  (interaction) => {

    const newEditButtons = ActionRowBuilder.from(interaction.message.components[0]) as ActionRowBuilder<ButtonBuilder>;
    const newStyle = interaction.component.style + 1 === 5 ? 1 : interaction.component.style + 1;
    newEditButtons.components.splice(0, 1, ButtonBuilder.from(interaction.component).setStyle(newStyle));

    interaction.update({ components: [newEditButtons] });

  },
);

module.exports = [changeStyle];