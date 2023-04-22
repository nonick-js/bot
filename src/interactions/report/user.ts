import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, ComponentType, EmbedBuilder, formatEmoji, ModalBuilder, PermissionFlagsBits, roleMention, TextInputBuilder, TextInputStyle, time, User } from 'discord.js';
import { Modal, UserContext } from '@akki256/discord-interaction';
import { Emojis, Fields } from '../../module/constant';
import { getServerSetting } from '../../module/mongo/middleware';

const reportContext = new UserContext({
  name: 'ユーザーを報告',
  dmPermission: false,
}, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  const setting = await getServerSetting(interaction.guildId, 'report');
  const user = interaction.targetUser;
  const member = interaction.targetMember;

  if (!setting?.channel) {
    if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: '`❌` この機能を使用するには追加で設定が必要です。`/setting`で報告を受け取るチャンネルを設定してください。', ephemeral: true });
    else return interaction.reply({ content: '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。', ephemeral: true });
  }


  if (user.system || user.id === interaction.client.user.id) return interaction.reply({ content: '`❌` このユーザーを通報することはできません。', ephemeral: true });
  if (user.id === interaction.user.id) return interaction.reply({ content: '`❌` 自分自身を報告しようとしています。', ephemeral: true });
  if (member && member?.permissions?.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: '`❌` サーバー運営を報告することはできません。', ephemeral: true });

  interaction.showModal(
    new ModalBuilder()
      .setCustomId('nonick-js:userReportModal')
      .setTitle('ユーザーを報告')
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId(interaction.targetId)
            .setLabel('詳細')
            .setPlaceholder('送信した報告はサーバーの運営のみ公開され、DiscordのTrust&Safetyには報告されません。')
            .setMaxLength(1500)
            .setStyle(TextInputStyle.Paragraph),
        ),
      ),
  );
});

const reportContextModal = new Modal({
  customId: 'nonick-js:userReportModal',
}, async (interaction) => {
  if (!interaction.inCachedGuild() || !interaction.channel || interaction.components[0].components[0].type !== ComponentType.TextInput) return;

  const setting = await getServerSetting(interaction.guildId, 'report');
  if (!setting?.channel) return interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });

  const user = await interaction.client.users.fetch(interaction.components[0].components[0].customId).catch(() => undefined);
  const channel = await interaction.guild.channels.fetch(setting.channel).catch(() => undefined);

  if (!(user instanceof User) || !channel?.isTextBased()) return interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true });

  channel
    .send({
      content: setting.mention?.enable ? roleMention(setting.mention.role || '0') : undefined,
      embeds: [
        new EmbedBuilder()
          .setTitle('`📢` ユーザーの通報')
          .setDescription(Fields.multiLine(
            Fields.memberTag(user, { text: '送信者' }),
            Fields.schedule(user.createdAt, { text: 'アカウント作成日', flag: 'D' }),
            '',
            Fields.memberTag(interaction.user, { text: '報告者', color: 'Blurple' })
          ))
          .setColor(Colors.DarkButNotBlack)
          .setThumbnail(user.displayAvatarURL())
          .setFields(
            { name: '理由', value: interaction.components[0].components[0].value },
          ),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId('nonick-js:report-completed')
            .setLabel('対処済み')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('nonick-js:report-ignore')
            .setLabel('無視')
            .setStyle(ButtonStyle.Danger),
        ),
      ],
    })
    .then(message => {
      interaction.reply({ content: '`✅` **報告ありがとうございます！** サーバー運営に報告を送信しました', ephemeral: true });
      message.startThread({ name: `${user.username}への通報` }).catch(() => { });
    })
    .catch(() => interaction.reply({ content: '`❌` 報告の送信中にエラーが発生しました', ephemeral: true }));
});

export default [reportContext, reportContextModal];