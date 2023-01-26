import { Button } from '@akki256/discord-interaction';
import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js';
import { WhiteEmojies } from '../../../../module/emojies';

const removeRoleButton = new Button(
  { customId: 'nonick-js:embedMaker-selectRole-removeRole' },
  async (interaction): Promise<void> => {

    const components = interaction.message.components;

    if (components[0].components[0].type !== ComponentType.StringSelect) {
      interaction.reply({ content: '`❌` セレクトメニューを作成していません！', ephemeral: true });
      return;
    }
    else if (components[0].components[0].options.length == 1) {
      interaction.update({ components: [components[1]] });
      return;
    }

    await interaction.update({
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-removeRoleSelect')
            .setOptions(
              { label: '削除せず戻る ', value: 'return', emoji: WhiteEmojies.reply },
              ...components[0].components[0].options.map((v, index) => ({
                label: v.label,
                description: v.description,
                value: String(index),
                emoji: v.emoji,
              })),
            )
            .setPlaceholder('削除するオプションを選択'),
        ),
      ],
    });

    interaction.message
      .awaitMessageComponent({
        componentType: ComponentType.StringSelect,
        filter: v => v.customId == 'nonick-js:embedMaker-selectRole-removeRoleSelect' && v.user.id == interaction.user.id,
        time: 60_000,
      })
      .then((selectInteraction) => {
        const value = selectInteraction.values[0];

        if (value == 'return') {
          selectInteraction.update({ components: [...components] });
          return;
        }

        if (components[0].components[0].type !== ComponentType.StringSelect) return;
        const options = components[0].components[0].options;
        options.splice(Number(value), 1);

        selectInteraction.update({
          components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
              StringSelectMenuBuilder
                .from(components[0].components[0].toJSON())
                .setOptions(options),
            ),
            components[1],
          ],
        });
      })
      .catch(() => interaction.editReply({ components: [...components] }));
  },
);

module.exports = [removeRoleButton];