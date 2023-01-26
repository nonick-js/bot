import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, formatEmoji, PermissionFlagsBits } from 'discord.js';
import { MessageContext } from '@akki256/discord-interaction';
import { WhiteEmojies } from '../../module/emojies';

const editEmbedContext = new MessageContext(
  {
    name: '埋め込みを編集',
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    dmPermission: false,
  },
  async (interaction): Promise<void> => {

    if (!interaction.inCachedGuild()) return;
    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageWebhooks)) {
      interaction.reply({ content: '`❌` この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります。', ephemeral: true });
      return;
    }

    const myWebhookId = (await interaction.guild.fetchWebhooks()).find(v => v.owner?.id == interaction.client.user.id)?.id;

    if (!myWebhookId || !interaction.targetMessage.webhookId || myWebhookId !== interaction.targetMessage.webhookId) {
      interaction.reply({ content: '`❌` NoNICK.jsを使用し、かつ現在もアクティブなWebhookで投稿した埋め込みのみ編集できます。', ephemeral: true });
      return;
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('`🧰` 埋め込みの編集・拡張')
          .setDescription([
            `${formatEmoji(WhiteEmojies.pencil)}: 埋め込みを編集`,
            `${formatEmoji(WhiteEmojies.addSelectRole)}: ロール付与(セレクトメニュー)を追加`,
            `${formatEmoji(WhiteEmojies.addButtonRole)}: ロール付与(ボタン)を追加 (準備中)`,
            `${formatEmoji(WhiteEmojies.addLink)}: URLボタンを追加 (準備中)`,
            `${formatEmoji(WhiteEmojies.setting)}: コンポーネントの管理`,
          ].join('\n'))
          .setColor(Colors.Blurple)
          .setFooter({ text: `メッセージID: ${interaction.targetId}`, iconURL: interaction.targetMessage.author.displayAvatarURL() }),
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
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-buttonRole')
            .setEmoji(WhiteEmojies.addButtonRole)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('nonick-js:embedMaker-editEmbedPanel-linkButton')
            .setEmoji(WhiteEmojies.addLink)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
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

module.exports = [editEmbedContext];