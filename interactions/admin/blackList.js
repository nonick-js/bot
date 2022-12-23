const fs = require('fs');

const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const { admin } = require('../../config.json');
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const CheckPermission = require('./_permissionCheck');

/** @type {import('@akki256/discord-interaction').ChatInputRegister} */
const commandInteraction = {
  data: {
    name: 'blacklist',
    description: '[🔧] ブラックリストを管理します',
    options: [
      {
        name: 'add',
        description: '🔧 ブラックリストに追加',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'id',
            description: 'ID',
            type: ApplicationCommandOptionType.String,
            minLength: 18,
            maxLength: 20,
            required: true,
          },
          {
            name: 'type',
            description: 'タイプ',
            type: ApplicationCommandOptionType.String,
            choices: [
              { name: 'サーバー', value: 'guilds' },
              { name: 'ユーザー', value: 'users' },
            ],
            required: true,
          },
        ],
      },
      {
        name: 'remove',
        description: '[🔧] ブラックリストから削除',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'id',
            description: 'ID',
            type: ApplicationCommandOptionType.String,
            minLength: 18,
            maxLength: 20,
            required: true,
          },
          {
            name: 'type',
            description: 'タイプ',
            type: ApplicationCommandOptionType.String,
            choices: [
              { name: 'サーバー', value: 'guilds' },
              { name: 'ユーザー', value: 'users' },
            ],
            required: true,
          },
        ],
      },
    ],
    guildId: admin.guild,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    dmPermission: false,
    type: 'CHAT_INPUT',
  },
  exec: async (interaction) => {
    if (CheckPermission(interaction)) return interaction.reply({ embeds: [CheckPermission(interaction)], ephemeral: true });

    const subCommand = interaction.options.getSubcommand();
    const id = interaction.options.getString('id');
    const type = interaction.options.getString('type');

    try {
      if (subCommand == 'add') {
        if (config.blackList[type].includes(id)) throw 'その値は既に追加されています';
        config.blackList[type].push(id);

        const embed = new EmbedBuilder()
          .setDescription(`\`✅\` ID: \`${id}\`をブラックリスト「__${type}__」に追加しました`)
          .setColor(Colors.Green)
          .setFooter({ text: '反映するには「/reload」コマンドを実行する必要があります' });

        interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (subCommand == 'remove') {
        if (!config.blackList[type].includes(id)) throw 'その値はブラックリストに追加されていません';
        config.blackList[type] = config.blackList[type].filter(v => v !== id);

        const embed = new EmbedBuilder()
          .setDescription(`\`✅\` ID: \`${String(id)}\`をブラックリスト「__${type}__」から削除しました`)
          .setColor(Colors.Green)
          .setFooter({ text: '反映するには「/reload」コマンドを実行する必要があります' });

        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (err) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` ' + err)
        .setColor(Colors.Red);

      interaction.reply({ embeds: [embed], ephemeral: true });
    }

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  },
};
module.exports = [ commandInteraction ];