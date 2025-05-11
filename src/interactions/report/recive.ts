import { Button, Modal } from '@akki256/discord-interaction';
import {
  ActionRowBuilder,
  type ButtonInteraction,
  ChannelType,
  Colors,
  ComponentType,
  ContainerBuilder,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

const completeButton = new Button(
  { customId: 'nonick-js:report-completed' },
  (interaction) => closeReport(interaction, true),
);

const ignoreButton = new Button(
  { customId: 'nonick-js:report-ignore' },
  (interaction): void => {
    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:report-ignoreReasonModal')
        .setTitle('対応なしとしてマーク')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('対応なしに設定する理由')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );
  },
);

const ignoreReasonModal = new Modal(
  { customId: 'nonick-js:report-ignoreReasonModal' },
  async (interaction) => {
    const reason = interaction.fields.getTextInputValue('reason');
    closeReport(interaction, false, reason);
  },
);

async function closeReport(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  isCompleted: boolean,
  reason?: string,
) {
  if (
    interaction instanceof ModalSubmitInteraction &&
    !interaction.isFromMessage()
  )
    return;

  const thread = interaction.message.thread;
  const container = interaction.message.components.find(
    (component) => component.type === ComponentType.Container,
  );

  if (!container || thread?.type !== ChannelType.PublicThread) return;

  interaction.update({
    components: [
      new ContainerBuilder(container.toJSON()).setAccentColor(
        isCompleted ? Colors.Green : Colors.Red,
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });

  thread
    .send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: `${interaction.user.username} が報告を${isCompleted ? '対応済み' : '対応なし'}としてマークしました`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setDescription(reason ?? null)
          .setColor(isCompleted ? Colors.Green : Colors.Red),
      ],
    })
    .then(() => {
      thread.setLocked();
    });
}

export default [completeButton, ignoreButton, ignoreReasonModal];
