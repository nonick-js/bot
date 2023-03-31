import { Button, Modal } from '@akki256/discord-interaction';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent, ComponentType, ModalBuilder, PermissionFlagsBits, Role, TextInputBuilder, TextInputStyle, User } from 'discord.js';

const sendRoleButton = new Button(
  { customId: 'nonick-js:embedMaker-roleButton-send' },
  (interaction) => {

    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:embedMaker-roleButton-sendModal')
        .setTitle('ボタンを作成')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('roleNameOrId')
              .setLabel('ロールの名前またはID')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('displayName')
              .setLabel('ボタン上での表示名')
              .setPlaceholder('例: マイクラ勢')
              .setMaxLength(80)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
          new ActionRowBuilder<TextInputBuilder>().setComponents(
            new TextInputBuilder()
              .setCustomId('emojiNameOrId')
              .setLabel('Unicode絵文字 または カスタム絵文字')
              .setPlaceholder('一文字のみ・カスタム絵文字は名前かIDを入力')
              .setMaxLength(32)
              .setStyle(TextInputStyle.Short)
              .setRequired(false),
          ),
        ),
    );

  },
);

const sendRoleButtonModal = new Modal(
  { customId: 'nonick-js:embedMaker-roleButton-sendModal' },
  async (interaction) => {

    // Create Button
    if (!interaction.isFromMessage() || !interaction.inCachedGuild() || interaction.message.components[0].components[0].type !== ComponentType.Button || !interaction.channel) return;

    const emojiRegex = new RegExp(/\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu);
    const roleNameOrId = interaction.fields.getTextInputValue('roleNameOrId');
    const emojiNameOrId = interaction.fields.getTextInputValue('emojiNameOrId');

    const role = interaction.guild?.roles.cache.find(v => v.name === roleNameOrId || v.id === roleNameOrId);
    const emoji = interaction.guild.emojis.cache.find(v => v.name === emojiNameOrId)?.id || emojiNameOrId.match(emojiRegex)?.[0];

    if (!(role instanceof Role))
      return interaction.reply({ content: '`❌` 入力された値に一致するロールが見つかりませんでした。', ephemeral: true });
    if (role?.managed)
      return interaction.reply({ content: '`❌` そのロールは外部サービスによって管理されているため、セレクトメニューに追加できません。', ephemeral: true });

    const button = new ButtonBuilder()
      .setCustomId(`nonick-js:roleButton-${role.id}`)
      .setLabel(interaction.fields.getTextInputValue('displayName') || (role.name.length > 80 ? `${role.name.substring(0, 77)}...` : role.name))
      .setStyle(interaction.message.components[0].components[0].style);

    if (emoji) button.setEmoji(emoji);

    // Edit Message
    if (!interaction.guild.members.me?.permissions.has(PermissionFlagsBits.ManageWebhooks))
      return interaction.reply({ content: '`❌` この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります。', ephemeral: true });

    const targetId = interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await (await interaction.channel.fetch()).messages.fetch(targetId!).catch(() => undefined);

    if (!targetMessage)
      return interaction.reply({ content: '`❌` メッセージの取得中に問題が発生しました。', ephemeral: true });

    const webhook = await targetMessage.fetchWebhook().catch(() => null);
    if (!webhook || interaction.client.user.equals(webhook.owner as User))
      return interaction.reply({ content: '`❌` このメッセージは更新できません。', ephemeral: true });
    if (targetMessage.components[4]?.components?.length === 5)
      return interaction.reply({ content: '`❌` これ以上コンポーネントを追加できません！', ephemeral: true });
    if (targetMessage.components[0]?.components[0]?.type === ComponentType.StringSelect)
      return interaction.reply({ content: '`❌` セレクトメニューとボタンは同じメッセージに追加できません。', ephemeral: true });
    if (targetMessage.components.some(v => v.components.map(i => i.customId).includes(`nonick-js:roleButton-${role.id}`)))
      return interaction.reply({ content: '`❌` そのロールのボタンは既に追加されています。', ephemeral: true });

    // APIActionRowComponent<APIButtonComponent> | JSONEncodable<APIActionRowComponent<APIButtonComponent>>

    const updatedComponents = targetMessage.components.map(v => ActionRowBuilder.from<ButtonBuilder>(v as ActionRow<ButtonComponent>));
    const lastActionRow = updatedComponents.slice(-1)[0];

    if (!lastActionRow || lastActionRow.components.length === 5)
      updatedComponents.push(new ActionRowBuilder<ButtonBuilder>().setComponents(button));
    else
      updatedComponents.splice(updatedComponents.length - 1, 1, ActionRowBuilder.from<ButtonBuilder>(lastActionRow).addComponents(button));

    const embeds = interaction.message.embeds;
    const components = interaction.message.components;
    await interaction.update({ content: '`⌛` コンポーネントを追加中...', embeds: [], components: [] });

    await webhook.edit({ channel: interaction.channelId });
    webhook.editMessage(targetMessage, { components: updatedComponents })
      .then(() => interaction.editReply({ content: '`✅` コンポーネントを追加しました！', embeds, components }))
      .catch(() => interaction.editReply({ content: '`❌` コンポーネントの更新中に問題が発生しました。', embeds, components }));

  },
);

module.exports = [sendRoleButton, sendRoleButtonModal];