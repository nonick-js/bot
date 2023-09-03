import { Button, Modal } from '@akki256/discord-interaction';
import ServerSettings from '../../../schemas/ServerSettings';
import { changeChannelSetting, changeToggleSetting } from '../_functions';
import { FeatureType } from '../_messages';
import { channelModal } from '../_modals';

const timeoutLogSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-log-timeout-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'log.timeout.enable': !Setting?.log.timeout.enable } }, FeatureType.EventLog);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-log-timeout-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-log-timeout-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-log-timeout-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'log.timeout.channel', FeatureType.EventLog),
  ),
];

const kickLogSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-log-kick-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'log.kick.enable': !Setting?.log.kick.enable } }, FeatureType.EventLog);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-log-kick-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-log-kick-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-log-kick-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'log.kick.channel', FeatureType.EventLog),
  ),
];

const banLogSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-log-ban-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'log.ban.enable': !Setting?.log.ban.enable } }, FeatureType.EventLog);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-log-ban-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-log-ban-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-log-ban-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'log.ban.channel', FeatureType.EventLog),
  ),
];

const voiceLogSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-log-voice-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'log.voice.enable': !Setting?.log.voice.enable } }, FeatureType.EventLog);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-log-voice-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-log-voice-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-log-voice-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'log.voice.channel', FeatureType.EventLog),
  ),
];

const deleteLogSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-log-delete-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'log.delete.enable': !Setting?.log.delete.enable } }, FeatureType.EventLog);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-log-delete-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-log-delete-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-log-delete-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'log.delete.channel', FeatureType.EventLog),
  ),
];

module.exports = [...timeoutLogSetting, ...kickLogSetting, ...banLogSetting, ...voiceLogSetting, ...deleteLogSetting];