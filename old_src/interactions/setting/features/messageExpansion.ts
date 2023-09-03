import { Button, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import ServerSettings from '../../../schemas/ServerSettings';
import { changeToggleSetting, reloadMessage } from '../_functions';
import { FeatureType } from '../_messages';

const generalSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-message-expansion-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'message.expansion.enable': !Setting?.message.expansion.enable } }, FeatureType.MessageExpansion);
    },
  ),
];

const ignoreSetting = [
  // 例外 (タイプ)
  new SelectMenu(
    { customId: 'nonick-js:setting-message-expansion-ignore-types', type: SelectMenuType.String },
    async (interaction) => {
      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'message.expansion.ignore.types': interaction.values.map(v => Number(v)) } },
        { upsert: true, new: true },
      );

      reloadMessage(interaction, res, FeatureType.MessageExpansion);
    },
  ),

  // 例外 (チャンネル)
  new SelectMenu(
    { customId: 'nonick-js:setting-message-expansion-ignore-channels', type: SelectMenuType.Channel },
    async (interaction) => {
      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'message.expansion.ignore.channels': interaction.values } },
        { upsert: true, new: true },
      );

      reloadMessage(interaction, res, FeatureType.MessageExpansion);
    },
  ),
];

module.exports = [...generalSetting, ...ignoreSetting];