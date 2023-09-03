import { ActionRowBuilder, Colors, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { changeToggleSetting, changeChannelSetting } from '../_functions';
import { Button, Modal } from '@akki256/discord-interaction';
import { isURL } from '../../../module/functions';
import { joinAndLeaveMessagePlaceHolder } from '../../../module/placeholders';
import { FeatureType } from '../_messages';
import { channelModal } from '../_modals';
import ServerSettings from '../../../schemas/ServerSettings';

const joinMessageSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-message-join-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'message.join.enable': !Setting?.message.join.enable } }, FeatureType.JoinAndLeaveMessage);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-message-join-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-message-join-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-message-join-channel-modal' },
    async (interaction) => changeChannelSetting(interaction, 'message.join.channel', FeatureType.JoinAndLeaveMessage),
  ),

  // メッセージ
  new Button(
    { customId: 'nonick-js:setting-message-join-message' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      const embed = EmbedBuilder.from(Setting?.message.join.messageOptions.embeds?.[0] || {});

      interaction.showModal(
        new ModalBuilder()
          .setCustomId('nonick-js:setting-message-join-message-modal')
          .setTitle('メッセージ')
          .setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('title')
                .setLabel('タイトル')
                .setValue(embed.data.title || '')
                .setMaxLength(256)
                .setStyle(TextInputStyle.Short)
                .setRequired(false),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('url')
                .setLabel('タイトルURL')
                .setValue(embed.data.url || '')
                .setPlaceholder('例）https://docs.nonick-js.com')
                .setStyle(TextInputStyle.Short)
                .setRequired(false),
            ),
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('description')
                .setLabel('説明')
                .setValue(embed.data.description || '')
                .setMaxLength(3999)
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('Tips: 公式ドキュメントに特殊な構文の使用方法が載っています。')
                .setRequired(false),
            ),
          ),
      );
    },
  ),
  new Modal(
    { customId: 'nonick-js:setting-message-join-message-modal' },
    async (interaction) => {
      if (!interaction.isFromMessage()) return;

      const title = interaction.fields.getTextInputValue('title');
      const url = interaction.fields.getTextInputValue('url');
      const description = interaction.fields.getTextInputValue('description');

      if (!title && !description)
        return interaction.reply({ content: '`❌` タイトルと説明はどちらかは必ず入力する必要があります。', ephemeral: true });
      if (url && !isURL(url))
        return interaction.reply({ content: '`❌` `http://`または`https://`から始まるURLを入力してください。', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle(title || null)
        .setURL(url || null)
        .setColor(Colors.Green)
        .setDescription(description || null);

      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'message.join.messageOptions.embeds': [embed.toJSON()] } },
        { upsert: true, new: true },
      );

      interaction.update({});
      res.save({ wtimeout: 1_500 });
    },
  ),

  // プレビュー
  new Button(
    { customId: 'nonick-js:setting-message-join-preview' },
    async (interaction) => {
      if (!interaction.inCachedGuild()) return;
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

      const option = Setting?.message.join.messageOptions;
      if (!option) return interaction.reply({ content: '`❌` メッセージが設定されていません', ephemeral: true });

      const guild = interaction.guild;
      const user = interaction.user;

      interaction.reply({
        content: joinAndLeaveMessagePlaceHolder.parse(option.content || '', ({ guild, user })) || undefined,
        embeds: option.embeds?.map(v => EmbedBuilder.from(v)).map(v => EmbedBuilder.from(v)
          .setTitle(joinAndLeaveMessagePlaceHolder.parse(v.data.title || '', ({ guild, user })) || null)
          .setDescription(joinAndLeaveMessagePlaceHolder.parse(v.data.description || '', ({ guild, user })) || null)
          .setURL(v.data.url || null)
          .setColor(Colors.Green)
          .setThumbnail(interaction.user.displayAvatarURL())),
        ephemeral: true,
      });
    },
  ),
];

const leaveMessageSetting = [
  // 有効・無効化
  new Button(
    { customId: 'nonick-js:setting-message-leave-enable' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });
      changeToggleSetting(interaction, { $set: { 'message.leave.enable': !Setting?.message.leave.enable } }, FeatureType.JoinAndLeaveMessage);
    },
  ),

  // 送信先
  new Button(
    { customId: 'nonick-js:setting-message-leave-channel' },
    (interaction) => interaction.showModal(channelModal.setCustomId('nonick-js:setting-message-leave-channel-modal')),
  ),
  new Modal(
    { customId: 'nonick-js:setting-message-leave-channel-modal' },
    (interaction) => changeChannelSetting(interaction, 'message.leave.channel', FeatureType.JoinAndLeaveMessage),
  ),

  // メッセージ
  new Button(
    { customId: 'nonick-js:setting-message-leave-message' },
    async (interaction) => {
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

      interaction.showModal(
        new ModalBuilder()
          .setCustomId('nonick-js:setting-message-leave-message-modal')
          .setTitle('メッセージ')
          .setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('content')
                .setLabel('メッセージ')
                .setPlaceholder('Tips: 公式ドキュメントに特殊な構文の使用方法が載っています。')
                .setMaxLength(2000)
                .setValue(Setting?.message.leave.messageOptions.content || '')
                .setStyle(TextInputStyle.Paragraph),
            ),
          ),
      );
    },
  ),
  new Modal(
    { customId: 'nonick-js:setting-message-leave-message-modal' },
    async (interaction) => {
      if (!interaction.isFromMessage()) return;

      const res = await ServerSettings.findOneAndUpdate(
        { serverId: interaction.guildId },
        { $set: { 'message.leave.messageOptions.content': interaction.fields.getTextInputValue('content') } },
        { upsert: true, new: true },
      );

      interaction.update({});
      res.save({ wtimeout: 1_500 });
    },
  ),

  // プレビュー
  new Button(
    { customId: 'nonick-js:setting-message-leave-preview' },
    async (interaction) => {
      if (!interaction.inCachedGuild()) return;
      const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

      const option = Setting?.message.leave.messageOptions;
      if (!option) return interaction.reply({ content: '`❌` メッセージが設定されていません', ephemeral: true });

      const guild = interaction.guild;
      const user = interaction.user;

      interaction.reply({
        content: joinAndLeaveMessagePlaceHolder.parse(option.content || '', ({ guild, user })) || undefined,
        embeds: option.embeds?.map(v => EmbedBuilder.from(v)).map(v => EmbedBuilder.from(v)
          .setTitle(joinAndLeaveMessagePlaceHolder.parse(v.data.title || '', ({ guild, user })) || null)
          .setDescription(joinAndLeaveMessagePlaceHolder.parse(v.data.description || '', ({ guild, user })) || null)
          .setURL(v.data.url || null)
          .setColor(Colors.Green)
          .setThumbnail(interaction.user.displayAvatarURL())),
        ephemeral: true,
      });
    },
  ),
];

module.exports = [...joinMessageSetting, ...leaveMessageSetting];