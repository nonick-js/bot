import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '../module/format';

const firstMessageCommand = new ChatInput({
  name: 'firstmessage',
  description: 'チャンネルの最初に投稿されたメッセージのURLボタンを送信',
  options: [
    {
      name: 'content',
      description: 'メッセージ',
      maxLength: 200,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: 'label',
      description: 'ボタンのテキスト',
      maxLength: 80,
      type: ApplicationCommandOptionType.String,
    },
  ],
  defaultMemberPermissions: PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages,
  dmPermission: false,
}, { coolTime: Duration.toMS('50s') }, async (interaction) => {
  if (!interaction.channel) return;

  interaction.channel.messages.fetch({ after: '1', limit: 1 })
    .then((messages) => {
      interaction.reply({
        content: interaction.options.getString('content') ?? undefined,
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setLabel(interaction.options.getString('label') ?? '最上部へ移動')
              .setURL(messages.first()?.url || `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messages.first()?.id}`)
              .setStyle(ButtonStyle.Link),
          ),
        ],
      });
    })
    .catch(() => {
      interaction.reply({ content: '`❌` メッセージを取得できませんでした', ephemeral: true });
    });
});

export default [firstMessageCommand];