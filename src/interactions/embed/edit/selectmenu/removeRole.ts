import { Button } from '@akki256/discord-interaction';
import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js';
import { WhiteEmojies } from '../../../../module/emojies';

const removeRoleButton = new Button(
  { customId: 'nonick-js:embedMaker-selectRole-removeRole' },
  async (interaction) => {

    const components = interaction.message.components;

    if (components[0].components[0].type !== ComponentType.StringSelect)
      return interaction.reply({ content: '`❌` セレクトメニューを作成していません！', ephemeral: true });
    if (components[0].components[0].options.length === 1)
      return interaction.update({ components: [components[1]] });

    await interaction.update({
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-removeRoleSelect')
            .setOptions(
              { label: '削除せず戻る ', value: 'back', emoji: WhiteEmojies.reply },
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
        filter: v => v.customId === 'nonick-js:embedMaker-selectRole-removeRoleSelect' && v.user.id === interaction.user.id,
        time: 60_000,
      })
      .then((selectInteraction) => {
        if (components[0].components[0].type !== ComponentType.StringSelect) return;

        if (selectInteraction.values[0] === 'back')
          return selectInteraction.update({ components: [...components] });

        selectInteraction.update({
          content: null,
          components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
              StringSelectMenuBuilder
                .from(components[0].components[0].toJSON())
                .setOptions(components[0].components[0].options.filter((v, index) => Number(selectInteraction.values[0]) !== index)),
            ),
            components[1],
          ],
        });
      })
      .catch(() => {
        interaction.editReply({ content: null, components: [...components] });
      });
  },
);

module.exports = [removeRoleButton];