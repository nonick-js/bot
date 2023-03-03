import { Button, Modal, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import ServerSettings from '../../../schemas/ServerSettings';
import { changeChannelSetting, changeToggleSetting, reloadMessage } from '../_functions';
import { FeatureType } from '../_messages';
import { channelModal } from '../_modals';

const generalSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-changeVerificationLevel-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'changeVerificationLevel.enable': !Setting?.changeVerificationLevel.enable } }, FeatureType.ChangeVerificationLevel);
    },
  ),

  // 開始・終了時刻
  new Button(
    { customId: 'nonick-js:setting-changeVerificationLevel-time' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

      interaction.showModal(
        new ModalBuilder()
          .setCustomId('nonick-js:setting-changeVerificationLevel-time-modal')
          .setTitle('開始・終了時間')
          .setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('start')
                .setLabel('開始時間 (0~23)')
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setValue(Setting?.changeVerificationLevel.time.start == null ? '' : String(Setting?.changeVerificationLevel.time.start)),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('end')
                .setLabel('終了時間 (0~23)')
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setValue(Setting?.changeVerificationLevel.time.end == null ? '' : String(Setting?.changeVerificationLevel.time.end)),
            ),
          ),
      );
    },
  ),
  new Modal(
    { customId: 'nonick-js:setting-changeVerificationLevel-time-modal' },
    async (interaction) => {
      if (!interaction.isFromMessage() || !interaction.inCachedGuild()) return;

      const start = parseInt(interaction.fields.getTextInputValue('start'), 10);
      const end = parseInt(interaction.fields.getTextInputValue('end'), 10);

      if (isNaN(start) || start > 23 || start < 0)
        return interaction.reply({ content: '`❌` 開始時間に無効な値が入力されました。', ephemeral: true });
      if (isNaN(end) || end > 23 || end < 0)
        return interaction.reply({ content: '`❌` 終了時間に無効な値が入力されました。', ephemeral: true });
      if (start == end)
        return interaction.reply({ content: '`❌` 開始時間と終了時間を同じ値に設定することはできません。', ephemeral: true });

      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: {
          'changeVerificationLevel.time.start': start,
          'changeVerificationLevel.time.end': end,
        } },
        { upsert: true, new: true },
      );

      reloadMessage(interaction, res, FeatureType.ChangeVerificationLevel);
    },
  ),

  // 認証レベル
  new SelectMenu(
    { customId: 'nonick-js:setting-changeVerificationLevel-level', type: SelectMenuType.String },
    async (interaction) => {
      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'changeVerificationLevel.level.new': Number(interaction.values[0]) } },
        { upsert: true, new: true },
      );
      reloadMessage(interaction, res, FeatureType.ChangeVerificationLevel);
    },
  ),
];

const logSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-changeVerificationLevel-log-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'changeVerificationLevel.log.enable': !Setting?.changeVerificationLevel.log.enable } }, FeatureType.ChangeVerificationLevel);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-changeVerificationLevel-log-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-changeVerificationLevel-log-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-changeVerificationLevel-log-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'changeVerificationLevel.log.channel', FeatureType.ChangeVerificationLevel),
  ),
];

module.exports = [...generalSetting, ...logSetting];