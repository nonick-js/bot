import { ApplicationCommandOptionType, codeBlock, Colors, EmbedBuilder, GuildMember, PermissionFlagsBits } from 'discord.js';
import { ChatInput } from '@akki256/discord-interaction';
import { toMS } from '../../module/date';

const timeoutCommand = new ChatInput(
  {
    name: 'timeout',
    description: 'ユーザーをタイムアウト (公式の機能より柔軟な設定が可能)',
    options: [
      {
        name: 'user',
        description: 'ユーザー',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'day',
        description: '日',
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'hour',
        description: '時',
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'minute',
        description: '分',
        type: ApplicationCommandOptionType.Number,
      },
      {
        name: 'reason',
        description: '理由',
        type: ApplicationCommandOptionType.String,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    dmPermission: false,
  },
  { coolTime: 5000 },
  (interaction) => {

    if (!interaction.inCachedGuild()) return;

    const member = interaction.options.getMember('user');
    const duration = (
      toMS(`${interaction.options.getNumber('day') || 0}d`)
      + toMS(`${interaction.options.getNumber('hour') || 0}h`)
      + toMS(`${interaction.options.getNumber('minute') || 0}m`)
    );

    if (duration == 0)
      return interaction.reply({ content: '`❌` 合計時間は1分以上から設定できます。', ephemeral: true });
    if (toMS('28d') <= duration)
      return interaction.reply({ content: '`❌` 28日以上のタイムアウトはできません。', ephemeral: true });
    if (!(member instanceof GuildMember))
      return interaction.reply({ content: '`❌` このユーザーはサーバーにいません。', ephemeral: true });
    if (member.id == interaction.user.id)
      return interaction.reply({ content: '`❌` 自分自身にコマンドを使用しています', ephemeral: true });
    if (!member.moderatable)
      return interaction.reply({ content: '`❌` 権限不足によりタイムアウトに失敗しました', ephemeral: true });
    if (interaction.user.id !== interaction.guild.ownerId && interaction.member.roles.highest.position < member.roles.highest.position)
      return interaction.reply({ content: '`❌` あなたの権限ではこのユーザーをタイムアウトできません', ephemeral: true });

    member.timeout(duration, `${interaction.options.getString('reason') ?? '理由が入力されていません'} - ${interaction.user.tag}`)
      .then(() => {
        const day = Math.floor(duration / toMS('1d'));
        const hour = Math.floor((duration % toMS('1d') / toMS('1h')));
        const minute = ((duration % toMS('1d')) % toMS('1h')) / toMS('1m');

        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`\`✅\` ${member}を **${day}**日**${hour}**時間**${minute}**分 タイムアウトしました`)
              .setColor(Colors.Green),
          ],
          ephemeral: true,
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`\`❌\` タイムアウトに失敗しました。\n${codeBlock(err)}`)
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      });

  },
);


module.exports = [timeoutCommand];