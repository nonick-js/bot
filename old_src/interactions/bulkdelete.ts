import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, codeBlock, Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

const bulkDeleteMessagesCommand = new ChatInput(
  {
    name: 'bulkdelete',
    description: 'このチャンネルに送信されたメッセージを最新順に一括削除 (2週間前まで)',
    options: [
      {
        name: 'messages',
        description: '削除するメッセージの数',
        maxValue: 100,
        minValue: 2,
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
  },
  { coolTime: 10_000 },
  async (interaction) => {

    if (!interaction.inCachedGuild() || !interaction.channel) return;

    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({ content: '`❌` BOTの権限が不足しているため、メッセージを削除できませんでした。', ephemeral: true });

    const bulkCount = interaction.options.getInteger('messages', true);

    interaction.channel.bulkDelete(bulkCount, true)
      .then((msgs) => interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`\`✅\` メッセージを\`${msgs.size}件\`削除しました`)
            .setColor(Colors.Green),
        ],
        ephemeral: true,
      }))
      .catch((err) => interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`\`❌\` メッセージの削除に失敗しました。\n${codeBlock(err)}`)
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      }));

  },
);

module.exports = [bulkDeleteMessagesCommand];
