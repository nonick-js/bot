import { Button, Modal } from '@akki256/discord-interaction';
import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
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
  TextInputBuilder,
  TextInputStyle,
  escapeMarkdown,
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

  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
  });
  if (!setting) return;

  const components = [];
  const thread = interaction.channel?.isThread()
    ? interaction.channel
    : interaction.message.thread;
  if (thread?.type !== ChannelType.PublicThread) return;

  const container = interaction.message.components.find(
    (component) => component.type === ComponentType.Container,
  );

  if (
    thread.parent?.type === ChannelType.GuildForum &&
    thread.parentId === setting.channel
  ) {
    if (isCompleted && setting.forumCompletedTag)
      await thread
        .setAppliedTags([...thread.appliedTags, setting.forumCompletedTag])
        .catch(() => {});
    if (!isCompleted && setting.forumIgnoredTag)
      await thread
        .setAppliedTags([...thread.appliedTags, setting.forumIgnoredTag])
        .catch(() => {});
  }

  const embed = new EmbedBuilder()
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setDescription(
      `報告を${isCompleted ? '対応済み' : '対応なし'}としてマークしました`,
    )
    .setColor(isCompleted ? Colors.Green : Colors.Red);
  if (!isCompleted)
    embed.setFooter({ text: `理由: ${escapeMarkdown(reason ?? '')}` });

  await thread
    .send({
      embeds: [embed],
    })
    .then(async () => {
      await thread.setLocked();
      thread.setArchived();
    });

  await db
    .delete(report)
    .where(
      and(
        eq(report.guildId, interaction.guildId),
        eq(report.channelId, interaction.channelId),
        eq(report.threadId, thread.id),
      ),
    );

  if (!container) return;
  components.push(
    new ContainerBuilder(container.toJSON()).setAccentColor(
      isCompleted ? Colors.Green : Colors.Red,
    ),
  );

  interaction.update({
    components,
    flags: MessageFlags.IsComponentsV2,
  });
}

export default [completeButton, ignoreButton, ignoreReasonModal];
