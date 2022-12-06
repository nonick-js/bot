const { ApplicationCommandOptionType, PermissionFlagsBits, Colors, EmbedBuilder, codeBlock } = require('discord.js');
const date = require('../modules/date');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'timeout',
    description: 'ユーザーをタイムアウト (公式の機能より柔軟な設定が可能です)',
    options: [
      {
        name: 'user',
        description: 'ユーザー',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'day',
        description: '日数',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'hour',
        description: '時数',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'minute',
        description: '分数',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'reason',
        description: '理由',
        type: ApplicationCommandOptionType.String,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    coolTime: 5000,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    const duration = (
      date.toMS(interaction.options.getNumber('day') + 'd')
      + date.toMS(interaction.options.getNumber('hour') + 'h')
      + date.toMS(interaction.options.getNumber('minute') + 'm')
    );

    try {
      if (!member) throw 'そのユーザーはこのサーバーにいません';
      if (member.id == interaction.user.id) throw '自分自身にコマンドを使用しています';
      if (member.id == interaction.client.user.id) throw `${interaction.client.user}自身をタイムアウトすることはできません`;
      if (!member.moderatable) throw `BOTの権限不足により${member}をタイムアウトできません`;
      if (interaction.user.id !== interaction.guild.ownerId &&
        interaction.member.roles.highest.position < member.roles.highest.position) throw 'あなたの権限ではこのユーザーをタイムアウトできません';
    } catch (err) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` ' + err)
        .setColor(Colors.Red);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    member.timeout(duration, (reason ?? '理由が入力されていません') + ` by ${interaction.user.tag}`)
      .then(() => {
        const day = Math.floor(duration / date.toMS('1d'));
        const hour = Math.floor((duration % date.toMS('1d') / date.toMS('1h')));
        const minute = ((duration % date.toMS('1d')) % date.toMS('1h')) / date.toMS('1m');

        const embed = new EmbedBuilder()
          .setDescription(`\`⛔\` ${member}を \`${day}\`日\`${hour}\`時間\`${minute}\`分 タイムアウトしました`)
          .setColor(Colors.Red);

        interaction.reply({ embeds: [embed], ephemeral: true });
      })
      .catch((err) => {
        const embed = new EmbedBuilder()
          .setDescription(`\`❌\`予期しないエラーによりタイムアウトに失敗しました。\n${codeBlock(err)}`)
          .setColor(Colors.Red);

        interaction.reply({ embeds: [embed], ephemeral: true });
      });
  },
};
module.exports = [ commandInteraction ];