const { Colors, PermissionFlagsBits, TextInputStyle, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, codeBlock } = require('discord.js');
const ConfigSchema = require('../../../schemas/configSchema');
const Buttons = require('./buttons');

/** @type {import('@akki256/discord-interaction').MessageRegister} */
const messageContext = {
  data: {
    name: 'メッセージを通報',
    dmPermission: false,
    type: 'MESSAGE',
  },
  exec: async (interaction) => {
    const GuildConfig = await ConfigSchema.findOne({ serverId: interaction.guildId });

    const message = interaction.targetMessage;
    const user = message.author;
    const member = await interaction.guild.members.fetch(user.id).catch(() => {});

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
      if (user.system) throw 'システムメッセージは通報できません';
      if (message.webhookId) throw 'Webhookは通報できません';
      if (user.id == interaction.user.id) throw '自分自身を通報しようとしています';
      if (user.id == interaction.client.user.id) throw `${interaction.client.user}自身を通報することはできません`;
      if (member?.permissions?.has(PermissionFlagsBits.ManageMessages)) throw 'サーバー運営は通報できません';
    } catch (err) {
      const embed = new EmbedBuilder()
        .setDescription('`❌` ' + err)
        .setColor(Colors.Red);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:messageReportModal')
      .setTitle('メッセージを通報')
      .setComponents(
        new ActionRowBuilder().setComponents(
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
    customId: 'nonick-js:messageReportModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const GuildConfig = await ConfigSchema.findOne({ serverId: interaction.guildId });

    const customId = interaction.components[0].components[0].customId;
    const reason = interaction.components[0].components[0].value;

    const message = await interaction.channel.messages.fetch(customId).catch(() => {});
    const channel = await interaction.guild.channels.fetch(GuildConfig?.report?.channel).catch(() => {});

    try {
      if (!message) throw '通報しようとしているメッセージは削除されました';
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

    const content = `\`⚠️\` ${interaction.user}が${interaction.channel}で**メッセージ**を通報しました`;
    const reportedContent = message.content.length > 2300 ? message.content.substring(0, 2300) + '...' : message.content;
    const attachmentLinks = message.attachments.size ? `__[${message.attachments.size}件の添付ファイル](${message.url})__` : '';

    const components = ActionRowBuilder.from(Buttons[0]).addComponents(
      new ButtonBuilder()
        .setLabel('メッセージ')
        .setURL(message.url)
        .setStyle(ButtonStyle.Link),
    );

    const embed = new EmbedBuilder()
      .setDescription(`${message.author} \`${message.author.tag}\``)
      .setColor(Colors.DarkButNotBlack)
      .setFields(
        { name: 'メッセージ', value: `${reportedContent}\n\n${attachmentLinks}` },
        { name: '詳細', value: codeBlock(reason) },
      )
      .setThumbnail(message.author.displayAvatarURL());

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

module.exports = [ messageContext, modalInteraction ];