import { Button, Modal, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import ServerSettings from '../../../../schemas/ServerSettings';
import { changeToggleSetting, reloadMessage } from '../_functions';
import { FeatureType } from '../_messages';
import { channelModal } from '../_modals';

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
  new Button(
    { customId: 'nonick-js:setting-message-expansion-ignore-addChannel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-message-expansion-ignore-addChannel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-message-expansion-ignore-addChannel-modal' },
    async (interaction) => {
      if (!interaction.isFromMessage() || !interaction.inCachedGuild()) return;

      const nameOrId = interaction.fields.getTextInputValue('nameOrId');
      const channel = interaction.guild.channels.cache.find(v => v.name == nameOrId || v.id == nameOrId);

      if (!channel)
        return interaction.reply({ content: '`❌` 条件に一致するチャンネルが見つかりませんでした。', ephemeral: true });
      if (channel.isThread())
        return interaction.reply({ content: '`❌` スレッドチャンネルを設定することはできません。', ephemeral: true });

      const Setting = await ServerSettings.findOne({ serverId: interaction.guild.id });
      const guildChannels = interaction.guild.channels.cache.map(v => v.id);
      const ignoreChannels = Setting?.message.expansion.ignore.ids.filter(v => guildChannels.includes(v)) || [];

      if (ignoreChannels.length > 29) return interaction.reply({ content: '`❌` これ以上チャンネルを追加することはできません。' });

      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'message.expansion.ignore.ids': [...ignoreChannels, channel.id] } },
        { upsert: true, new: true },
      );

      reloadMessage(interaction, res, FeatureType.MessageExpansion);
    },
  ),

  // 例外チャンネルを全て削除
  new Button(
    { customId: 'nonick-js:setting-message-expansion-ignore-deleteAll' },
    async (interaction) => {
      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'message.expansion.ignore.ids': [] } },
        { upsert: true, new: true },
      );
      reloadMessage(interaction, res, FeatureType.MessageExpansion);
    },
  ),
];

module.exports = [...generalSetting, ...ignoreSetting];