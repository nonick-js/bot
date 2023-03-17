import { Button } from '@akki256/discord-interaction';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent } from 'discord.js';

const changeStyle = new Button(
  { customId: 'nonick-js:embedMaker-roleButton-changeStyle' },
  (interaction) => {

    const newEditButtons = ActionRowBuilder.from<ButtonBuilder>(interaction.message.components[0] as ActionRow<ButtonComponent>);
    const newStyle = interaction.component.style + 1 === 5 ? 1 : interaction.component.style + 1;
    newEditButtons.components.splice(0, 1, ButtonBuilder.from(interaction.component).setStyle(newStyle));

    interaction.update({ components: [newEditButtons] });

  },
);

module.exports = [changeStyle];