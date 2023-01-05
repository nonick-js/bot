const { EmbedBuilder, ModalBuilder, time, Colors, PermissionFlagsBits, ActionRowBuilder, TextInputBuilder, TextInputStyle, codeBlock, formatEmoji } = require('discord.js');
const ConfigSchema = require('../../../schemas/configSchema');
const Buttons = require('./buttons');

/** @type {import('@akki256/discord-interaction').UserRegister} */
const userContextInteraction = {
  data: {
    name: 'ユーザーを通報',
    dmPermission: false,
    type: 'USER',
  },
  exec: async (interaction) => {
    const GuildConfig = await ConfigSchema.findOne({ serverId: interaction.guildId });

    const user = interaction.targetUser;
    const member = interaction.targetMember;

    if (!GuildConfig?.report?.channel) {
      const warnEmbedForAdmin = new EmbedBuilder()
        .setTitle('この機能を使用するには追加で設定が必要です')
        .setDescription('`/setting`で通報機能の設定を開き、通報を受け取るチャンネルを設定してください。')
        .setColor(Colors.Blue)
				.setImage('https://cdn.discordapp.com/attachments/958791423161954445/976117804879192104/unknown.png');

      const warnEmbed = new EmbedBuilder()
        .setTitle('この機能を利用するには追加で設定が必要です')
        .setDescription('BOTの設定権限を持っている人に連絡してください')
        .setColor(Colors.Blue);

      return interaction.reply({
        embeds: [interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) ? warnEmbedForAdmin : warnEmbed],
        ephemeral: true,
      });
    }

    try {
      if (!user) throw 'そのユーザーは通報できません';
      if (user.system) throw 'システムユーザーは通報できません';
      if (user.id == interaction.user.id) throw '自分自身を通報しようとています';
      if (user.id == interaction.client.user.id) throw `${interaction.client.user}自身を通報することはできません`;
      if (member?.permissions?.has(PermissionFlagsBits.ManageMessages)) throw 'サーバー運営は通報できません';
    } catch (err) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` ' + err)
        .setColor(Colors.Red);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:userReportModal')
      .setTitle('ユーザーを通報')
      .setComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(interaction.targetId)
            .setLabel('詳細')
            .setPlaceholder('送信した通報はサーバーの運営のみ公開され、Trust & Safetyには報告されません。')
            .setMaxLength(1500)
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'nonick-js:userReportModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const GuildConfig = await ConfigSchema.findOne({ serverId: interaction.guildId });

    const customId = interaction.components[0].components[0].customId;
		const reason = interaction.components[0].components[0].value;

		const user = await interaction.client.users.fetch(customId).catch(() => {});
    const channel = await interaction.guild.channels.fetch(GuildConfig?.report?.channel).catch(() => {});

    try {
      if (!user) throw 'ユーザーの情報の取得に失敗したため、通報を送信できませんでした';
      if (!channel?.sendable) {
        await GuildConfig.updateOne({ $set: { 'report.channel': null } });
        GuildConfig.save({ wtimeout: 1500 });
        throw '現在の設定で通報を送信することができませんでした。サーバーの管理者にご連絡ください';
      }
    } catch (err) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` ' + err)
        .setColor(Colors.Red);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const content = `\`⚠️\` ${interaction.user}が${interaction.channel}で**ユーザー**を通報しました！`;
    const createTime = time(Math.floor(user.createdTimestamp / 1000), 'D');
    const components = Buttons[0];

    const embed = new EmbedBuilder()
      .setDescription([
        `${user} \`${user.tag}\``,
        '',
        `${formatEmoji('1014603109001085019')}アカウント作成日: ${createTime}`,
      ].join('\n'))
      .setColor('2f3136')
      .setFields({ name: '通報理由', value: codeBlock(reason) })
      .setThumbnail(user.displayAvatarURL());

    channel.send({
      content: GuildConfig?.report?.mention?.enable ? `${GuildConfig?.report?.mention?.role}\n${content}` : content,
      embeds: [embed],
      components: [components],
    })
    .then(() => {
      const successEmbed = new EmbedBuilder()
        .setDescription('✅ **報告ありがとうございます！** 通報をサーバー運営に送信しました')
        .setColor(Colors.Green);

      interaction.reply({ embeds: [successEmbed], ephemeral: true });
    })
    .catch((err) => {
      const errorEmbed = new EmbedBuilder()
        .setDescription(`\`❌\` 通報の送信中に予期しないエラーが発生しました。\n${codeBlock(err)}`)
        .setColor(Colors.Red);

      interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    });
  },
};

module.exports = [ userContextInteraction, modalInteraction ];