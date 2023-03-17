import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, formatEmoji, PermissionFlagsBits, StringSelectMenuBuilder } from 'discord.js';
import { MessageContext, Button } from '@akki256/discord-interaction';
import { embedEditButtons } from '../../embed/create/_components';
import { WhiteEmojies } from '../../../module/emojies';

const context = new MessageContext(
  {
    name: '埋め込みを編集',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    dmPermission: false,
  },
  async (interaction) => {

    if (!interaction.inCachedGuild()) return;
    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageWebhooks))
      return interaction.reply({ content: '`❌` この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります。', ephemeral: true });

    const myWebhookId = (await interaction.guild.fetchWebhooks().catch(() => undefined))?.find(v => v.owner?.id === interaction.client.user.id)?.id;
    if (!myWebhookId || !interaction.targetMessage.webhookId || myWebhookId !== interaction.targetMessage.webhookId)
      return interaction.reply({ content: '`❌` NoNICK.jsを使用し、かつ現在も有効なWebhookで投稿した埋め込みのみ編集できます。', ephemeral: true });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🧰` 埋め込みの編集・拡張')
          .setDescription([
            `${formatEmoji(WhiteEmojies.pencil)}: 埋め込みを編集`,
            `${formatEmoji(WhiteEmojies.addSelectRole)}: ロール付与(セレクトメニュー)を追加`,
            `${formatEmoji(WhiteEmojies.addButtonRole)}: ロール付与(ボタン)を追加`,
            `${formatEmoji(WhiteEmojies.addLink)}: URLボタンを追加`,
            `${formatEmoji(WhiteEmojies.setting)}: コンポーネントの削除`,
          ].join('\n'))
          .setColor(Colors.Blurple)
          .setFooter({ text: `メッセージID: ${interaction.targetId}` }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-edit')
            .setEmoji(WhiteEmojies.pencil)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-selectRole')
            .setEmoji(WhiteEmojies.addSelectRole)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-roleButton')
            .setEmoji(WhiteEmojies.addButtonRole)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-linkButton')
            .setEmoji(WhiteEmojies.addLink)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-manageComponents')
            .setEmoji(WhiteEmojies.setting)
            .setStyle(ButtonStyle.Primary),
        ),
      ],
      ephemeral: true,
    });

  },
);

const editEmbed = new Button(
  { customId: 'nonick-js:embedMaker-editEmbedPanel-edit' },
  async (interaction) => {

    await interaction.deferUpdate();
    const targetId = interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await interaction.channel?.messages.fetch(targetId || '')?.catch(() => undefined);

    if (!targetMessage) return interaction.reply({ content: '`❌` メッセージの取得中に問題が発生しました。', ephemeral: true });

    interaction.editReply({
      content: interaction.message.embeds[0].footer?.text,
      embeds: targetMessage.embeds,
      components: embedEditButtons,
    });

  },
);

const createSelectMenu = new Button(
  { customId: 'nonick-js:embedMaker-editEmbedPanel-selectRole' },
  (interaction) => {

    interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle('ロール付与(セレクトメニュー)の追加')
          .setDescription('下のボタンを使用してセレクトメニューを作成し、「追加」ボタンでメッセージにコンポーネントを追加します。(最大5個まで)'),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:emberMaker-selectRole-placeholder')
            .setEmoji(WhiteEmojies.pencil)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-addRole')
            .setEmoji(WhiteEmojies.addMark)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-removeRole')
            .setEmoji(WhiteEmojies.removeMark)
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-selectMode-single')
            .setLabel('選択：1つのみ')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-selectRole-sendComponent')
            .setLabel('追加')
            .setStyle(ButtonStyle.Primary),
        ),
      ],
    });

  },
);

const createRoleButton = new Button(
  { customId: 'nonick-js:embedMaker-editEmbedPanel-roleButton' },
  (interaction) => {

    interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle('ロール付与(ボタン)の追加')
          .setDescription('「ボタンを作成」ボタンを使用するとメッセージにコンポーネントを追加します。(最大25個まで)'),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-roleButton-changeStyle')
            .setEmoji('🎨')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-roleButton-send')
            .setLabel('ボタンを作成')
            .setEmoji(WhiteEmojies.addMark)
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
    });

  },
);

const createUrlButton = new Button(
  { customId: 'nonick-js:embedMaker-editEmbedPanel-linkButton' },
  (interaction) => {

    interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle('URLボタンの追加')
          .setDescription('「ボタンを作成」ボタンを使用するとメッセージにコンポーネントを追加します。(最大25個まで)'),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-linkButton-send')
            .setLabel('ボタンを作成')
            .setEmoji(WhiteEmojies.addMark)
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
    });

  },
);

const manageComponents = new Button(
  { customId: 'nonick-js:embedMaker-editEmbedPanel-manageComponents' },
  async (interaction) => {

    if (!interaction.channel) return;

    const targetId = interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await (await interaction.channel.fetch()).messages.fetch(targetId!).catch(() => undefined);

    if (!targetMessage)
      return interaction.reply({ content: '`❌` メッセージの取得中に問題が発生しました。', ephemeral: true });
    if (targetMessage.components.length === 0)
      return interaction.reply({ content: '`❌` コンポーネントを一つも追加していません。', ephemeral: true });

    interaction.update({
      embeds: [
        EmbedBuilder
          .from(interaction.message.embeds[0])
          .setTitle('コンポーネントの削除')
          .setDescription('下のセレクトメニューから削除するコンポーネントの行を選択してください'),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('nonick-js:manageComponents-delete')
            .setOptions(targetMessage.components.map((v, index) => ({ label: `${index + 1}行目`, value: String(index) })))
            .setMaxValues(targetMessage.components.length),
        ),
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:manageComponents-deleteAll')
            .setLabel('全てのコンポーネントを削除')
            .setEmoji('🗑')
            .setStyle(ButtonStyle.Danger),
        ),
      ],
    });

  },
);

module.exports = [context, editEmbed, createSelectMenu, createRoleButton, createUrlButton, manageComponents];