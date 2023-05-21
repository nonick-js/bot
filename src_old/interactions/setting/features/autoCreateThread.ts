import { Button, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import ServerSettings from '../../../schemas/ServerSettings';
import { changeToggleSetting, reloadMessage } from '../_functions';
import { FeatureType } from '../_messages';

const generalSetting = [
  new SelectMenu({
    customId: 'nonick-js:setting-autoCreateThread-channels',
    type: SelectMenuType.Channel,
  }, async (interaction) => {
    const res = await ServerSettings.findOneAndUpdate(
      { serverId: interaction.guildId },
      { $set: { 'autoCreateThread.channels': interaction.values } },
      { upsert: true, new: true },
    );

    reloadMessage(interaction, res, FeatureType.AutoCreateThread);
  }),
  new Button({
    customId: 'nonick-js:setting-autoCreateThread-enable',
  }, async (interaction) => {
    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
    changeToggleSetting(interaction, { $set: { 'autoCreateThread.enable': !Setting?.autoCreateThread.enable } }, FeatureType.AutoCreateThread);
  }),
];

export default [...generalSetting];