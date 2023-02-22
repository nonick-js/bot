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
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'user',
        description: 'この引数に指定されたユーザーのメッセージのみを消去します',
        type: ApplicationCommandOptionType.User,
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

    const bulkCount = interaction.options.getNumber('messages', true);
    const user = interaction.options.getUser('user');

    if (!user) {
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
    }
    else {
      const messages = await interaction.channel.messages.fetch({ limit: bulkCount });
      interaction.channel.bulkDelete(messages.filter(v => v.author.id == user.id), true)
        .then((msgs) => interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`\`✅\` ${user}が投稿したメッセージを\`${msgs.size}件\`削除しました`)
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
    }

  },
);

module.exports = [bulkDeleteMessagesCommand];
