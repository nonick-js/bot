import { Button } from '@akki256/discord-interaction';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';

const changeSelectMode = new Button(
  { customId: /^nonick-js:embedMaker-selectRole-selectMode-(single|multi)$/ },
  (interaction) => {

    const isSingleMode = interaction.customId === 'nonick-js:embedMaker-selectRole-selectMode-single';
    const editButtons = interaction.message.components[1];
    if (!(editButtons instanceof ActionRow<MessageActionRowComponent>)) return;

    const newSelectModeButton = new ButtonBuilder()
      .setCustomId(isSingleMode ? 'nonick-js:embedMaker-selectRole-selectMode-multi' : 'nonick-js:embedMaker-selectRole-selectMode-single')
      .setLabel(isSingleMode ? '選択：複数選択可' : '選択：1つのみ')
      .setStyle(ButtonStyle.Success);

    if (editButtons?.components?.[3]?.type !== ComponentType.Button) {
      const newEditButtons = ActionRowBuilder.from<ButtonBuilder>(interaction.message.components[0] as ActionRow<ButtonComponent>);
      newEditButtons.components.splice(3, 1, newSelectModeButton);
      interaction.update({ content: null, components: [newEditButtons] });
    }
    else {
      const newEditButtons = ActionRowBuilder.from<ButtonBuilder>(editButtons as ActionRow<ButtonComponent>);
      newEditButtons.components.splice(3, 1, newSelectModeButton);
      interaction.update({ content: null, components: [interaction.message.components[0], newEditButtons] });
    }

  },
);

module.exports = [changeSelectMode];