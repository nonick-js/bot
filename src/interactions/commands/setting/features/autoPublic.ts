import { Button, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import ServerSettings from '../../../../schemas/ServerSettings';
import { changeToggleSetting, reloadMessage } from '../_functions';
import { FeatureType } from '../_messages';

const generalSetting = [
  new SelectMenu(
    { customId: 'nonick-js:setting-autoPublic-channels', type: SelectMenuType.Channel },
    async (interaction) => {
      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'autoPublic.channels': interaction.values } },
        { upsert: true, new: true },
      );

      reloadMessage(interaction, res, FeatureType.AutoPublic);
    },
  ),
  new Button(
    { customId: 'nonick-js:setting-autoPublic-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'autoPublic.enable': !Setting?.autoPublic.enable } }, FeatureType.AutoPublic);
    },
  ),
];

module.exports = [...generalSetting];