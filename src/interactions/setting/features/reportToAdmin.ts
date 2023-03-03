import { Button, Modal } from '@akki256/discord-interaction';
import { changeChannelSetting, changeMentionRoleSetting, changeToggleSetting } from '../_functions';
import { channelModal, roleModal } from '../_modals';
import ServerSettings from '../../../schemas/ServerSettings';
import { FeatureType } from '../_messages';

const generalSetting = [
  // 送信先
  new Button(
    { customId: 'nonick-js:setting-report-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-report-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-report-channel-modal' },
    (interaction) =>  changeChannelSetting(interaction, 'report.channel', FeatureType.ReportToAdmin),
  ),
];

const mentionSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-report-mention-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'report.mention.enable': !Setting?.report.mention.enable } }, FeatureType.ReportToAdmin);
    },
  ),

  // ロール
  new Button(
    { customId: 'nonick-js:setting-report-mention-role' },
    (interaction) => interaction.showModal(roleModal.setCustomId('nonick-js:setting-report-mention-role-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-report-mention-role-modal' },
    async (interaction) => changeMentionRoleSetting(interaction, 'report.mention.role', FeatureType.ReportToAdmin),
  ),
];

module.exports = [...generalSetting, ...mentionSetting];