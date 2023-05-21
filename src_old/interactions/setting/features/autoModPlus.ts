import { Button, Modal, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import ServerSettings from '../../../schemas/ServerSettings';
import { changeChannelSetting, changeToggleSetting, reloadMessage } from '../_functions';
import { FeatureType } from '../_messages';
import { channelModal } from '../_modals';

const generalSetting = [
  // 有効・無効化
  new Button({
    customId: 'nonick-js:setting-automod-enable',
  }, async (interaction) => {
    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
    changeToggleSetting(interaction, { $set: { 'autoMod.enable': !Setting?.autoMod.enable } }, FeatureType.AutoModPlus);
  }),

  // フィルター
  new SelectMenu({
    customId: 'nonick-js:setting-automod-filter',
    type: SelectMenuType.String,
  }, async (interaction) => {
    const values = interaction.values;
    const res = await ServerSettings.findOneAndUpdate(
      { serverId: interaction.guildId },
      {
        $set: {
          'autoMod.filter.inviteUrl': values.includes('inviteUrl'),
          'autoMod.filter.token': values.includes('token'),
          'autoMod.filter.shortUrl': values.includes('shortUrl'),
        },
      },
      { upsert: true, new: true },
    );

    reloadMessage(interaction, res, FeatureType.AutoModPlus);
  }),
];

const logSetting = [
  // 有効・無効化
  new Button({
    customId: 'nonick-js:setting-automod-log-enable',
  }, async (interaction) => {
    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
    changeToggleSetting(interaction, { $set: { 'autoMod.log.enable': !Setting?.autoMod.log.enable } }, FeatureType.AutoModPlus);
  }),

  // 送信先
  new Button({
    customId: 'nonick-js:setting-automod-log-channel',
  }, (interaction) => {
    interaction.showModal(channelModal.setCustomId('nonick-js:setting-automod-log-channel-modal'));
  }),
  new Modal({
    customId: 'nonick-js:setting-automod-log-channel-modal',
  }, (interaction) => {
    changeChannelSetting(interaction, 'autoMod.log.channel', FeatureType.AutoModPlus);
  }),
];

const ignoreSetting = [
  // チャンネル
  new SelectMenu({
    customId: 'nonick-js:setting-automod-ignore-channels',
    type: SelectMenuType.Channel,
  }, async (interaction) => {
    const res = await ServerSettings.findOneAndUpdate(
      { serverId: interaction.guildId },
      { $set: { 'autoMod.ignore.channels': interaction.values } },
      { upsert: true, new: true },
    );

    reloadMessage(interaction, res, FeatureType.AutoModPlus);
  }),

  // ロール
  new SelectMenu({
    customId: 'nonick-js:setting-automod-ignore-roles',
    type: SelectMenuType.Role,
  }, async (interaction) => {
    const res = await ServerSettings.findOneAndUpdate(
      { serverId: interaction.guildId },
      { $set: { 'autoMod.ignore.roles': interaction.values } },
      { upsert: true, new: true },
    );

    reloadMessage(interaction, res, FeatureType.AutoModPlus);
  }),

  // 全て削除
  new Button({
    customId: 'nonick-js:setting-automod-ignore-deleteAll',
  }, async (interaction) => {
    const res = await ServerSettings.findOneAndUpdate(
      { serverId: interaction.guildId },
      {
        $set: {
          'autoMod.ignore.channels': [],
          'autoMod.ignore.roles': [],
        },
      },
      { upsert: true, new: true },
    );

    reloadMessage(interaction, res, FeatureType.AutoModPlus);
  }),
];

export default [...generalSetting, ...logSetting, ...ignoreSetting];