const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, EmbedBuilder, Colors } = require('discord.js');
const { errorEmbed } = require('../../../utils/embeds');
const { isURL } = require('../../../utils/functions');

/** @type {import('@akki256/discord-interaction').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-sendEmbed',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageWebhooks)) {
      return interaction.reply({
        embeds: [errorEmbed('この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります!', true)],
        ephemeral: true })
      .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    }

    const webhooks = await interaction.guild.fetchWebhooks();
    const myWebhook = webhooks.find(v => v.owner.id == interaction.client.user.id);

    const modal = new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-sendEmbedModal')
      .setTitle('埋め込みを送信')
      .setComponents(
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('name')
            .setLabel('名前 (省略可能)')
            .setMaxLength(80)
            .setPlaceholder('入力するとその名前で埋め込みを送信します')
            .setValue(myWebhook?.name || '')
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder().setComponents(
          new TextInputBuilder()
            .setCustomId('iconUrl')
            .setLabel('アイコンのURL (省略可能)')
            .setPlaceholder('入力するとそのアイコンで埋め込みを送信します')
            .setValue(myWebhook?.avatarURL() || '')
            .setMaxLength(1000)
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@akki256/discord-interaction').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'nonick-js:embedMaker-sendEmbedModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds?.[0];
    if (!embed) return interaction.update({});

    const name = interaction.fields.getTextInputValue('name');
    const iconUrl = interaction.fields.getTextInputValue('iconUrl');

    const successEmbed = new EmbedBuilder()
      .setDescription('`✅` 埋め込みを送信しました!')
      .setColor(Colors.Green);

    // Webhook Mode
    if (name || iconUrl) {
      await interaction.deferUpdate();

      try {
        if (iconUrl && !isURL(iconUrl)) throw 'httpまたはhttpsから始まる有効なURLを入力してください';
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageWebhooks)
        ) throw 'この機能を使用するにはBOTに`ウェブフックの管理`権限を付与する必要があります';
      }
      catch (err) {
        return interaction.followUp({ embeds: [errorEmbed(err, true)], ephemeral: true, fetchReply: true })
          .then((msg) => setTimeout(() => interaction.deleteReply(msg), 3000));
      }

      const webhooks = await interaction.guild.fetchWebhooks();
      /** @type {import('discord.js').Webhook} */
      const myWebhook = webhooks.find(v => v.owner.id == interaction.client.user.id) ||
        await interaction.channel.createWebhook({ name: 'NoNICK.js', avatar: interaction.client.user.displayAvatarURL() }).catch(() => {});

      if (!myWebhook) {
        return interaction.followUp({ embeds: [errorEmbed('予期しないエラーが発生し、Webhookを作成できませんでした', true)], ephemeral: true })
          .then((msg) => setTimeout(() => interaction.deleteReply(msg), 3000));
      }

      await myWebhook.edit({
        name: name || 'NoNICK.js',
        avatar: iconUrl,
        channel: interaction.channel.id,
      });

      return myWebhook.send({ embeds: [embed] })
        .then(() => {
          interaction.editReply({ content: '', embeds: [successEmbed], components: [] })
            .then(() => setTimeout(() => interaction.deleteReply(), 3000));
        })
        .catch(() => {
          interaction.followUp({
            embeds: [errorEmbed('埋め込みの送信に失敗しました。時間を置いて再度お試しください')],
            ephemeral: true,
          })
          .then((msg) => setTimeout(() => interaction.deleteReply(msg), 3000));
        });
    }

    if (!interaction.channel.permissionsFor(interaction.guild.members.me).has(
      PermissionFlagsBits.ViewChannel |
      PermissionFlagsBits.SendMessages |
      PermissionFlagsBits.EmbedLinks)
    ) {
      return interaction.reply({
        embeds: [
          errorEmbed([
            '`❌` このチャンネルでパネルを送信できません！',
            'BOTに`チャンネルを見る` `メッセージを送信` `埋め込みリンク`を付与してください',
          ].join('\n')),
        ],
        ephemeral: true })
      .then(() => setTimeout(() => interaction.deleteReply(), 3000));
    }

    interaction.channel.send({ embeds: [embed] })
      .then(() => {
        interaction.update({ content: '', embeds: [successEmbed], components: [] })
          .then(() => setTimeout(() => interaction.deleteReply(), 3000));
      })
      .catch(() => {
        interaction.reply({
          embeds: [errorEmbed('埋め込みの送信に失敗しました。時間を置いて再度お試しください', true)],
          ephemeral: true,
        })
        .then(() => setTimeout(() => interaction.deleteReply(), 3000));
      });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];