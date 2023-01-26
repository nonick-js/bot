import { Button } from '@akki256/discord-interaction';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ComponentType } from 'discord.js';

const changeSelectMode = new Button(
  { customId: /^nonick-js:embedMaker-selectRole-selectMode-(single|multi)$/ },
  (interaction): void => {

    const isSingleMode = interaction.customId == 'nonick-js:embedMaker-selectRole-selectMode-single';
    const editButtons = interaction.message.components[1];

    if (!(editButtons instanceof ActionRow) || editButtons.components?.[3].type !== ComponentType.Button) {
      interaction.reply({ content: '`❌` 選択モードを切り替えるにはロールを追加する必要があります。', ephemeral: true });
      return;
    }

    const newEditButtons = ActionRowBuilder.from(editButtons) as ActionRowBuilder<ButtonBuilder>;

    newEditButtons.components.splice(2, 1, (
      ButtonBuilder
        .from(editButtons.components[3])
        .setCustomId(isSingleMode ? 'nonick-js:embedMaker-selectRole-selectMode-multi' : 'nonick-js:embedMaker-selectRole-selectMode-single')
        .setLabel(isSingleMode ? '選択：複数選択可' : '選択：1つのみ')
    ));

    interaction.update({ components: [interaction.message.components[0], newEditButtons] });

  },
);

module.exports = [changeSelectMode];