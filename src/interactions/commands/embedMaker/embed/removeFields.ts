import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { Button, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { WhiteEmojies } from '../../../../module/emojies';
import { embedCreateButtons } from './_components';

const removeFieldButton = new Button(
  { customId: 'nonick-js:embedMaker-removeField' },
  async (interaction): Promise<void> => {
    const embed = interaction.message.embeds[0];

    if (embed.fields.length == 0) {
      interaction.reply({ content: '`❌` フィールドがありません', ephemeral: true });
      return;
    }
    else if (embed.fields.length == 1) {
      interaction.update({ embeds: [EmbedBuilder.from(embed).setFields()] });
      return;
    }

    interaction.update({
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('nonick-js:embedMaker-removeFieldSelect')
            .setOptions([
              { label: '削除せず戻る', value: 'return', emoji: WhiteEmojies.reply },
              ...embed.fields.map((v, index) => ({
                label: v.name,
                value: `${index}`,
                description: v.value.length > 20 ? `${v.value.substring(0, 20)} ...` : v.value,
                emoji: WhiteEmojies.message,
              })),
            ])
            .setPlaceholder('削除するフィールドを選択'),
        ),
      ],
    });
  },
);

const removeFieldSelect = new SelectMenu(
  {
    customId: 'nonick-js:embedMaker-removeFieldSelect',
    type: SelectMenuType.String,
  },
  (interaction): void => {
    const embed = interaction.message.embeds[0];
    const value = interaction.values[0];

    if (value == 'return') {
      interaction.update({ components: [...embedCreateButtons] });
      return;
    }

    const fields = embed.fields;
    fields.splice(Number(value), 1);

    interaction.update({
      embeds: [EmbedBuilder.from(embed).setFields(fields)],
      components: [...embedCreateButtons],
    });
  },
);

module.exports = [removeFieldButton, removeFieldSelect];