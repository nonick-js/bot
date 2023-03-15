import { Button } from '@akki256/discord-interaction';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';

const changeSelectMode = new Button(
  { customId: /^nonick-js:embedMaker-selectRole-selectMode-(single|multi)$/ },
  (interaction) => {

    const isSingleMode = interaction.customId === 'nonick-js:embedMaker-selectRole-selectMode-single';
    const editButtons = interaction.message.components[1];

    const newSelectModeButton = new ButtonBuilder()
      .setCustomId(isSingleMode ? 'nonick-js:embedMaker-selectRole-selectMode-multi' : 'nonick-js:embedMaker-selectRole-selectMode-single')
      .setLabel(isSingleMode ? '選択：複数選択可' : '選択：1つのみ')
      .setStyle(ButtonStyle.Success);

    if (editButtons?.components?.[3]?.type !== ComponentType.Button) {
      const newEditButtons = ActionRowBuilder.from(interaction.message.components[0]) as ActionRowBuilder<ButtonBuilder>;
      newEditButtons.components.splice(3, 1, newSelectModeButton);
      interaction.update({ content: null, components: [newEditButtons] });
    }
    else {
      const newEditButtons = ActionRowBuilder.from(editButtons) as ActionRowBuilder<ButtonBuilder>;
      newEditButtons.components.splice(3, 1, newSelectModeButton);
      interaction.update({ content: null, components: [interaction.message.components[0], newEditButtons] });
    }

  },
);

module.exports = [changeSelectMode];