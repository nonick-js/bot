import { MessageContext, SelectMenu, SelectMenuType } from '@akki256/discord-interaction';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, PermissionFlagsBits, StringSelectMenuBuilder, User } from 'discord.js';
import { Emojis } from '../../module/constant';
import { embedMakerType, getEmbedMakerButtons } from './embed/_function';
import { getRoleSelectMakerButtons } from './roleSelect/_function';

const context = new MessageContext(
  {
    name: '埋め込みを編集',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageWebhooks))
      return interaction.reply({ content: '`❌` この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります。', ephemeral: true });

    const webhook = await interaction.targetMessage.fetchWebhook().catch(() => null);
    if (!webhook || !interaction.client.user.equals(webhook.owner as User))
      return interaction.reply({ content: '`❌` NoNICK.jsを使用し、かつ現在も有効なWebhookで投稿した埋め込みのみ編集できます。', ephemeral: true });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🧰` 埋め込みの編集・拡張')
          .setDescription('埋め込みを編集したり、URLボタンやロール付与ボタン・セレクトメニューを追加することができます。')
          .setColor(Colors.Blurple)
          .setFooter({ text: `メッセージID: ${interaction.targetId}` }),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          new StringSelectMenuBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel')
            .setOptions(
              { label: '埋め込みを編集', value: 'editEmbed', emoji: Emojis.White.pencil },
              { label: '埋め込みをダウンロード', value: 'downloadEmbed', emoji: Emojis.White.download },
              { label: 'ロール付与(セレクトメニュー)を追加', value: 'addRoleSelect', emoji: Emojis.White.role2 },
              { label: 'ロール付与(ボタン)を追加', value: 'addRoleButton', emoji: Emojis.White.role2 },
              { label: 'URLボタンを追加', value: 'addUrlButton', emoji: Emojis.White.link },
              { label: 'コンポーネントの削除', value: 'delete', emoji: '🗑' },
            ),
        ),
      ],
      ephemeral: true,
    });
  },
);

const select = new SelectMenu(
  { customId: 'nonick-js:embedMaker-editEmbedPanel', type: SelectMenuType.String },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;
    const targetId = interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await interaction.channel?.messages.fetch(targetId || '')?.catch(() => undefined);

    if (!targetMessage)
      return interaction.update({ content: '`❌` メッセージの取得中に問題が発生しました。', embeds: [], components: [] });

    if (interaction.values[0] === 'editEmbed')
      interaction.update({
        content: `メッセージID: ${targetId}`,
        embeds: targetMessage.embeds,
        components: getEmbedMakerButtons(targetMessage.embeds[0], embedMakerType.edit),
      });

    else if (interaction.values[0] === 'downloadEmbed')
      interaction.showModal(
        new ModalBuilder()
          .setCustomId('nonick-js:embedMaker-exportModal')
          .setTitle('エクスポート')
          .setComponents(
            new ActionRowBuilder<TextInputBuilder>().setComponents(
              new TextInputBuilder()
                .setCustomId('fileName')
                .setLabel('ファイルの名前 (日本語は使用できません)')
                .setMaxLength(100)
                .setStyle(TextInputStyle.Short)
                .setRequired(false),
            ),
          ),
      );

    else if (interaction.values[0] === 'addRoleSelect') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
        return interaction.reply({ content: '`❌` あなたの権限ではこの機能は使用できません。', ephemeral: true });

      interaction.update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setTitle('`🧰` ロール付与(セレクトメニュー)の追加')
            .setDescription('下のボタンを使用してセレクトメニューを作成し、「追加」ボタンでメッセージにコンポーネントを追加します。(最大5個まで)'),
        ],
        components: [getRoleSelectMakerButtons()],
      });
    }

    else if (interaction.values[0] === 'addRoleButton') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
        return interaction.reply({ content: '`❌` あなたの権限ではこの機能は使用できません。', ephemeral: true });

      interaction.update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setTitle('`🧰` ロール付与(ボタン)の追加')
            .setDescription('「ボタンを作成」ボタンを使用するとメッセージにボタンを追加します。(最大25個まで)'),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('nonick-js:embedMaker-roleButton-send')
              .setLabel('ボタンを作成')
              .setEmoji(Emojis.White.addMark)
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId('nonick-js:embedMaker-roleButton-changeStyle')
              .setLabel('色')
              .setEmoji('🎨')
              .setStyle(ButtonStyle.Primary),
          ),
        ],
      });
    }

    else if (interaction.values[0] === 'addUrlButton')
      interaction.update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setTitle('URLボタンの追加')
            .setDescription('「ボタンを作成」ボタンを使用するとメッセージにボタンを追加します。(最大25個まで)'),
        ],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setCustomId('nonick-js:embedMaker-linkButton-send')
              .setLabel('ボタンを作成')
              .setEmoji(Emojis.White.addMark)
              .setStyle(ButtonStyle.Secondary),
          ),
        ],
      });

    else if (interaction.values[0] === 'delete') {
      if (targetMessage.components.length === 0)
        return interaction.reply({ content: '`❌` コンポーネントを一つも追加していません。', ephemeral: true });

      interaction.update({
        embeds: [
          EmbedBuilder
            .from(interaction.message.embeds[0])
            .setTitle('`🧰` コンポーネントの削除')
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
    }
  },
);

module.exports = [context, select];