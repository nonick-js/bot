import { Button, Modal } from '@akki256/discord-interaction';
import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import { permissionTexts } from '@modules/util';
import {
  ActionRowBuilder,
  type ButtonInteraction,
  ChannelType,
  Colors,
  ComponentType,
  ContainerBuilder,
  EmbedBuilder,
  InteractionType,
  MessageFlags,
  ModalBuilder,
  type ModalSubmitInteraction,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
  inlineCode,
} from 'discord.js';
import { and, eq } from 'drizzle-orm';

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

const deleteReportButton = new Button(
  { customId: 'nonick-js:report-delete' },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    if (
      !interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)
    ) {
      return interaction.reply({
        content: `\`❌\`この操作を実行するためには、このチャンネルの${inlineCode(permissionTexts.ManageMessages)}権限を所持している必要があります。`,
        ephemeral: true,
      });
    }
    if (
      !interaction.appPermissions.has([
        PermissionFlagsBits.ManageMessages,
        PermissionFlagsBits.ManageThreads,
      ])
    ) {
      return interaction.reply({
        content: `\`❌\`この操作を実行するためには、NoNICK.jsに${inlineCode(permissionTexts.ManageMessages)}および${inlineCode(permissionTexts.ManageThreads)}`,
        ephemeral: true,
      });
    }

    const thread = interaction.channel?.isThread()
      ? interaction.channel
      : interaction.message.thread;
    if (thread?.type !== ChannelType.PublicThread) return;

    await thread.delete(`${interaction.user.username}が報告を削除しました`);
    if (interaction.channel?.type === ChannelType.GuildText) {
      await interaction.message.delete();
    }

    await db
      .update(report)
      .set({ closedAt: new Date() })
      .where(
        and(
          eq(report.guildId, interaction.guildId),
          eq(report.channelId, interaction.channelId),
          eq(report.threadId, thread.id),
        ),
      );
  },
);

async function closeReport(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  isCompleted: boolean,
  reason?: string,
) {
  if (!interaction.inCachedGuild()) return;
  if (
    interaction.type === InteractionType.ModalSubmit &&
    !interaction.isFromMessage()
  )
    return;

  const components = [];
  const thread = interaction.channel?.isThread()
    ? interaction.channel
    : interaction.message.thread;
  if (thread?.type !== ChannelType.PublicThread) return;

  const container = interaction.message.components.find(
    (component) => component.type === ComponentType.Container,
  );

  if (!container) return;
  components.push(
    new ContainerBuilder(container.toJSON()).setAccentColor(
      isCompleted ? Colors.Green : Colors.Red,
    ),
  );

  await thread
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
    .then(async () => {
      await thread.setLocked();
      thread.setArchived();
    });

  await db
    .update(report)
    .set({ closedAt: new Date() })
    .where(
      and(
        eq(report.guildId, interaction.guildId),
        eq(report.channelId, interaction.channelId),
        eq(report.threadId, thread.id),
      ),
    );

  interaction.update({
    components,
    flags: MessageFlags.IsComponentsV2,
  });
}

export default [
  completeButton,
  ignoreButton,
  ignoreReasonModal,
  deleteReportButton,
];
