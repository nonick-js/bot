import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, codeBlock, Colors, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

const setRateLimitCommand = new ChatInput(
  {
    name: 'ratelimit',
    description: 'このチャンネルの低速モードを設定',
    options: [
      {
        name: 'duration',
        description: '秒数',
        maxValue: 21600,
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
  },
  { coolTime: 5_000 },
  async (interaction) => {

    if (!interaction.inCachedGuild() || !interaction.channel) return;
    const duration = interaction.options.getNumber('duration', true);

    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageChannels))
      return interaction.reply({ content: '`❌` BOTの権限が不足しているため、低速モードを変更できませんでした。', ephemeral: true });

    interaction.channel.setRateLimitPerUser(duration, `/ratelimit by ${interaction.user.tag}`)
      .then(() => interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`\`✅\` チャンネルの低速モードを\`${duration}秒\`に設定しました。`)
            .setColor(Colors.Green),
        ],
        ephemeral: true,
      }))
      .catch((err) => interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`\`❌\` 低速モードの設定に失敗しました。\n${codeBlock(err)}`)
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      }));

  },
);

module.exports = [setRateLimitCommand];