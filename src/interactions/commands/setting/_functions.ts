import { ActionRowBuilder, ButtonInteraction, ComponentType, MessageComponentInteraction, ModalSubmitInteraction, StringSelectMenuBuilder, TextChannel } from 'discord.js';
import { AnyObject, Document, UpdateQuery } from 'mongoose';
import { ControlPanelMessages, FeatureType } from './_messages';
import ServerSettings, { IServerSettings } from '../../../schemas/ServerSettings';
import { ControlPanelComponentPagination } from './_pagination';

export async function changeToggleSetting(interaction: ButtonInteraction, updateQuery: UpdateQuery<AnyObject>, key: FeatureType) {
  const res = await ServerSettings.findOneAndUpdate(
    { serverId: interaction.guildId },
    updateQuery,
    { upsert: true, new: true },
  );
  reloadMessage(interaction, res, key);
}

export async function changeChannelSetting(interaction: ModalSubmitInteraction, queryKey: string, key: FeatureType) {
  if (!interaction.isFromMessage() || !interaction.inCachedGuild()) return;

  const nameOrId = interaction.fields.getTextInputValue('nameOrId');
  const channel = interaction.guild.channels.cache.find(v => v.name == nameOrId || v.id == nameOrId);

  if (!channel)
    return interaction.reply({ content: '`❌` 条件に一致するチャンネルが見つかりませんでした。', ephemeral: true });
  if (!(channel instanceof TextChannel))
    return interaction.reply({ content: '`❌` 設定するチャンネルはテキストチャンネルである必要があります。', ephemeral: true });

  const res = await ServerSettings.findOneAndUpdate(
    { serverId: interaction.guildId },
    { $set: { [queryKey]: channel.id } },
    { upsert: true, new: true },
  );

  reloadMessage(interaction, res, key);
}

export async function changeMentionRoleSetting(interaction: ModalSubmitInteraction, queryKey: string, key: FeatureType) {
  if (!interaction.isFromMessage() || !interaction.inCachedGuild()) return;

  const nameOrId = interaction.fields.getTextInputValue('nameOrId');
  const role = interaction.guild.roles.cache.find(v => v.name == nameOrId || v.id == nameOrId);

  if (!role) return interaction.reply({ content: '`❌` 条件に一致するロールが見つかりませんでした。', ephemeral: true });

  const res = await ServerSettings.findOneAndUpdate(
    { serverId: interaction.guildId },
    { $set: { [queryKey]: role.id } },
    { upsert: true, new: true },
  );

  reloadMessage(interaction, res, key);
}

export async function reloadMessage(interaction: (MessageComponentInteraction | ModalSubmitInteraction), setting: (Document<unknown, unknown, IServerSettings> & IServerSettings), key: FeatureType): Promise<void> {
  if (interaction instanceof ModalSubmitInteraction && !interaction.isFromMessage()) return;
  await interaction.deferUpdate();

  const pagination = ControlPanelMessages.get(key);
  const select = interaction.message.components[0].components[0];
  if (!(pagination instanceof ControlPanelComponentPagination) || select.type !== ComponentType.StringSelect) return;

  const getComponents = pagination.components[select.options.findIndex(v => v.default)];

  interaction.editReply({
    embeds: pagination.options(setting).embeds,
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(StringSelectMenuBuilder.from(select)),
      ...getComponents(setting),
    ],
  });
  setting.save({ wtimeout: 1_500 });
}