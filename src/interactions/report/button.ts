import { Button, Modal } from '@akki256/discord-interaction';
import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ComponentType, EmbedBuilder, formatEmoji, Colors } from 'discord.js';
import { Emojis } from '../../module/constant';

const actionButton = new Button(
  { customId: /^nonick-js:report-(completed|ignore)$/ },
  (interaction): void => {
    const isCompleteButton = interaction.customId.replace('nonick-js:report-', '') === 'completed';

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:report-actionModal')
        .setTitle(`${isCompleteButton ? '対処済み' : '対処無し'}としてマーク`)
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId(isCompleteButton ? 'action' : 'reason')
              .setLabel(isCompleteButton ? '行った対処・処罰' : '対処なしの理由')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );
  },
);

const actionModal = new Modal(
  { customId: 'nonick-js:report-actionModal' },
  async (interaction) => {
    if (!interaction.isFromMessage() || interaction.components[0].components[0].type !== ComponentType.TextInput) return;

    const embed = interaction.message.embeds[0];
    const isAction = interaction.components[0].components[0].customId === 'action';
    const categoryValue = interaction.components[0].components[0].value;

    await interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle(`${embed.title} ` + (isAction ? '[対応済み]' : '[対応なし]'))
          .setDescription([
            `${embed.description}`,
            `${formatEmoji(Emojis.Blurple.member)} **対処者:** ${interaction.user} [${interaction.user.tag}]`,
            `${formatEmoji(Emojis.Blurple.admin)} **${isAction ? '行った処罰' : '対応なしの理由'}:** ${categoryValue}`,
          ].join('\n'))
          .setColor(isAction ? Colors.Green : Colors.Red),
      ],
      components: [],
    });

    if (interaction.message.hasThread) await interaction.message.thread?.setLocked(true).catch(() => { });
  },
);

module.exports = [actionButton, actionModal];