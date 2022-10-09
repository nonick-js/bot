const discord = require('discord.js');
const { settingSwitcher } = require('../../modules/settingStatusSwitcher');
const { welcomeM_preview } = require('../../modules/messageSyntax');
const Configs = require('../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const selectMenuInteraction_featureCategory = {
	data: {
    customId: 'setting-featureCategory',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const Config = await Configs.findOne({ serverId: interaction.guildId });

    const button = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId('setting-back')
        .setEmoji('971389898076598322')
				.setStyle(discord.ButtonStyle.Primary),
    );

    switch (interaction.values[0]) {
      case 'setting-welcomeMessage' : {
        const welcome = Config.welcome;
        const leave = Config.leave;

        const embed = new discord.EmbedBuilder()
          .setAuthor({ name: '設定 - 入退室メッセージ機能', iconURL: interaction.client.user.displayAvatarURL() })
          .setDescription([
            '```サーバーに新しくメンバーが参加した時や退室した時にメッセージを送信します。',
            '新規メンバーを歓迎したり、見てほしい情報が伝わりやすくなります。```\n\n',
          ].join(''))
          .setColor('Green')
          .setFields(
            { name: '入室メッセージ', value: settingSwitcher('STATUS_CH', welcome.enable, welcome.channel) + `\n\n> ${welcomeM_preview(welcome.message).split('\n').join('\n> ')}`, inline: true },
            { name: '退室メッセージ', value: settingSwitcher('STATUS_CH', leave.enable, leave.channel) + `\n\n> ${welcomeM_preview(leave.message).split('\n').join('\n> ')}`, inline: true },
					);

        const select = new discord.ActionRowBuilder().setComponents(
          new discord.SelectMenuBuilder()
            .setCustomId('setting-settingCategory')
            .setOptions(
              { label: '入室メッセージ', value: 'category-welcomeMessage-welcome', description: 'メンバー参加時にメッセージを送信', emoji: '966588719635267624', default: true },
              { label: '退室メッセージ', value: 'category-welcomeMessage-leave', description: 'メンバー退室時にメッセージを送信', emoji: '966588719635267624' },
            ),
        );
        button.addComponents(
          new discord.ButtonBuilder()
            .setCustomId('setting-welcome')
            .setLabel(settingSwitcher('BUTTON_LABEL', welcome.enable))
            .setStyle(settingSwitcher('BUTTON_STYLE', welcome.enable))
            .setDisabled(settingSwitcher('BUTTON_DISABLE', welcome.channel)),
          new discord.ButtonBuilder()
            .setCustomId('setting-welcomeCh')
            .setLabel('送信先')
            .setEmoji('966588719635267624')
            .setStyle(discord.ButtonStyle.Secondary),
          new discord.ButtonBuilder()
            .setCustomId('setting-welcomeMessage')
            .setLabel('メッセージ')
            .setEmoji('966596708458983484')
            .setStyle(discord.ButtonStyle.Secondary),
        );

        interaction.update({ embeds: [embed], components: [select, button] });
        break;
      }
      case 'setting-report': {
        const report = Config.report;

        const embed = new discord.EmbedBuilder()
          .setAuthor({ name: '設定 - 入退室メッセージ機能', iconURL: interaction.client.user.displayAvatarURL() })
          .setDescription([
            `${discord.formatEmoji('966588719614275584')}: 機能自体を無効にしたい場合は、\`サーバー設定 → 連携サービス → NoNICK.js\`からeveryoneの権限を変更することで無効にできます。`,
            '```メンバーがサーバールール等に違反しているメッセージを通報できる機能です。',
            'モデレーターがメッセージを監視する必要がなくなるため、運営の負担を減らせます。```\n\n',
          ].join(''))
          .setColor('Green')
          .setFields(
            { name: '通報の送信先', value: report.channel ? `<#${report.channel}>` : `${`${discord.formatEmoji('966588719635267624')}未設定`}`, inline: true },
            { name: 'ロールメンション', value: settingSwitcher('STATUS_ROLE', report.mention, report.mentionRole), inline: true },
          );

        const select = new discord.ActionRowBuilder().setComponents(
          new discord.SelectMenuBuilder()
            .setCustomId('setting-settingCategory')
            .setOptions(
              { label: '全般設定', value: 'category-report-general', emoji: '🌐', default: true },
              { label: 'ロールメンション機能', description: '通報受け取り時にロールをメンション', value: 'category-report-roleMention', emoji: '966719258430160986' },
            ),
        );
        button.addComponents(
          new discord.ButtonBuilder()
            .setCustomId('setting-reportCh')
            .setLabel('送信先')
            .setEmoji('966588719635267624')
            .setStyle(discord.ButtonStyle.Secondary),
        );

        interaction.update({ embeds: [embed], components: [select, button] });
        break;
      }
      case 'setting-messageExpansion': {
        const embed = new discord.EmbedBuilder()
          .setAuthor({ name: '設定 - リンク展開機能', iconURL: interaction.client.user.displayAvatarURL() })
          .setDescription([
            '```Discordのメッセージリンクを送信した際にリンク先のメッセージを表示してくれる機能です。',
            '流れてしまったメッセージや過去のメッセージをチャットに出したい時に便利です。```\n\n',
          ].join(''))
          .setColor('Green')
          .setFields({ name: '状態', value: settingSwitcher('STATUS_ENABLE', Config.messageExpansion), inline: true });

        const select = new discord.ActionRowBuilder().setComponents([
          new discord.SelectMenuBuilder()
            .setCustomId('setting-settingCategory')
            .setOptions({ label: '全般設定', value: 'category-messageExpansion-general', emoji: '966588719635267624', default:true }),
        ]);
        button.addComponents([
          new discord.ButtonBuilder()
            .setCustomId('setting-messageExpansion')
            .setLabel(settingSwitcher('BUTTON_LABEL', Config.messageExpansion))
            .setStyle(settingSwitcher('BUTTON_STYLE', Config.messageExpansion)),
        ]);

        interaction.update({ embeds: [embed], components: [select, button] });
        break;
      }
      case 'setting-log': {
        const log = Config.log;

        const logCategoryData = [
          { name: 'bot', value: `${interaction.client.user.username}` },
          { name: 'timeout', value: 'タイムアウト' },
          { name: 'kick', value: 'Kick' },
          { name: 'ban', value: 'BAN' },
        ];
        const enableLogCategory = logCategoryData.filter(v => log.category[v.name]).map(v => `\`${v.value}\``);

        const embed = new discord.EmbedBuilder()
          .setAuthor({ name: '設定 - ログ機能', iconURL: interaction.client.user.displayAvatarURL() })
          .setDescription([
            '```サーバー上のモデレーションやアクティビティをログとして送信する機能です。',
            '監査ログを使用するよりも簡単に確認することができます。```\n\n',
          ].join(''))
          .setColor('Green')
          .setFields(
            { name: '状態', value: settingSwitcher('STATUS_CH', log.enable, log.channel), inline: true },
            { name: 'イベント', value: enableLogCategory.join(' ') || 'なし', inline: true },
          );

        const select = new discord.ActionRowBuilder().setComponents(
          new discord.SelectMenuBuilder()
            .setCustomId('setting-settingCategory')
            .setOptions(
                { label: '全般設定', value: 'category-log-general', emoji: '🌐', default:true },
                { label: 'イベント設定', value: 'category-log-event', emoji: '1014603109001085019' },
            ),
        );
        button.addComponents(
          new discord.ButtonBuilder()
            .setCustomId('setting-log')
            .setLabel(settingSwitcher('BUTTON_LABEL', log.enable))
            .setStyle(settingSwitcher('BUTTON_STYLE', log.enable))
            .setDisabled(settingSwitcher('BUTTON_DISABLE', log.enable, log.channel)),
          new discord.ButtonBuilder()
            .setCustomId('setting-logCh')
            .setLabel('送信先')
            .setEmoji('966588719635267624')
            .setStyle(discord.ButtonStyle.Secondary),
        );

        interaction.update({ embeds: [embed], components: [select, button] });
        break;
      }
      case 'setting-verification': {
        const verification = Config.verification;

        const levelStatus = [
          'この文章が見えるのはおかしいよ',
          '`🟢` **低** `メール認証がされているアカウントのみ`',
          '`🟡` **中** `Discordに登録してから5分以上経過したアカウントのみ`',
          '`🟠` **高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`',
          '`🔴` **最高** `電話認証がされているアカウントのみ`',
        ];
        const time_h = verification.startChangeTime !== null ? `**${verification.startChangeTime}:00**` : '未設定';
        const time_m = verification.endChangeTime !== null ? `**${verification.endChangeTime}:00**` : '未設定';
        const time = `${time_h}～${time_m}`;

        const embed = new discord.EmbedBuilder()
          .setTitle('🛠 設定 - 認証レベル自動変更機能')
          .setDescription([
            `${discord.formatEmoji('966588719614275584')} 実行ログは\`ログ機能\`の\`${interaction.client.user.username}\`イベントに含まれています`,
            '```サーバーの認証レベルを指定した時間まで自動で変更する機能です。',
            '運営が浮上できない時間帯に設定することで荒らし対策をすることができます。```\n\n',
          ].join(''))
          .setColor('Green')
          .setFields(
            { name: '状態', value: settingSwitcher('STATUS_ENABLE', verification.enable), inline: true },
            { name: '自動変更期間', value: time, inline: true },
            { name: '自動変更するレベル', value: levelStatus[verification.newLevel] ?? '未設定' },
          );

        const select = new discord.ActionRowBuilder().addComponents(
          new discord.SelectMenuBuilder()
            .setCustomId('setting-settingCategory')
            .setOptions(
              { label: '全般設定', value: 'category-verification-general', emoji: '🌐', default:true },
              { label: '認証レベル設定', description: '自動変更期間の間変更されるレベル', value: 'category-verification-level', emoji: '966588719635263539' },
            ),
        );
        button.addComponents(
          new discord.ButtonBuilder()
            .setCustomId('setting-verification')
            .setLabel(settingSwitcher('BUTTON_LABEL', verification.enable))
            .setStyle(settingSwitcher('BUTTON_STYLE', verification.enable))
            .setDisabled(settingSwitcher('BUTTON_DISABLE', verification.newLevel && verification.startChangeTime !== null && verification.endChangeTime !== null)),
          new discord.ButtonBuilder()
            .setCustomId('setting-startChangeTime')
            .setLabel('開始時刻')
            .setEmoji('1014603109001085019')
            .setStyle(discord.ButtonStyle.Secondary),
          new discord.ButtonBuilder()
            .setCustomId('setting-endChangeTime')
            .setLabel('終了時刻')
            .setEmoji('1014603109001085019')
            .setStyle(discord.ButtonStyle.Secondary),
        );

        interaction.update({ embeds: [embed], components: [select, button] });
        break;
      }
      default:
        interaction.update({});
        break;
      }
    },
};

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const selectMenuInteraction_settingCategory = {
  data: {
    customId: 'setting-settingCategory',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const Config = await Configs.findOne({ serverId: interaction.guildId });

    /** @type {discord.ActionRow} */
    const button = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId('setting-back')
        .setEmoji('971389898076598322')
        .setStyle(discord.ButtonStyle.Primary),
    );
		const options = interaction.component.options.map(v => ({ label: v.label, value: v.value, emoji: v.emoji, default: v.value == interaction.values[0] }));
		const select = new discord.ActionRowBuilder().addComponents(discord.SelectMenuBuilder.from(interaction.component).setOptions(options));

    if (interaction.values[0].startsWith('category-welcomeMessage')) {
			const welcome = Config.welcome;
			const leave = Config.leave;

      switch (interaction.values[0]) {
        case 'category-welcomeMessage-welcome': {
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-welcome')
              .setLabel(settingSwitcher('BUTTON_LABEL', welcome.enable))
              .setStyle(settingSwitcher('BUTTON_STYLE', welcome.enable))
              .setDisabled(settingSwitcher('BUTTON_DISABLE', welcome.channel)),
						new discord.ButtonBuilder()
              .setCustomId('setting-welcomeCh')
              .setLabel('送信先')
              .setEmoji('966588719635267624')
              .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
              .setCustomId('setting-welcomeMessage')
              .setLabel('メッセージ')
              .setEmoji('966596708458983484')
              .setStyle(discord.ButtonStyle.Secondary),
          );
          break;
        }
        case 'category-welcomeMessage-leave': {
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-leave')
              .setLabel(settingSwitcher('BUTTON_LABEL', leave.enable))
              .setStyle(settingSwitcher('BUTTON_STYLE', leave.enable))
              .setDisabled(settingSwitcher('BUTTON_DISABLE', leave.channel)),
            new discord.ButtonBuilder()
              .setCustomId('setting-leaveCh')
              .setLabel('送信先')
              .setEmoji('966588719635267624')
              .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
              .setCustomId('setting-leaveMessage')
              .setLabel('メッセージ')
              .setEmoji('966596708458983484')
              .setStyle(discord.ButtonStyle.Secondary),
          );
          break;
        }
    }

      interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
    }

    if (interaction.values[0].startsWith('category-report')) {
      const report = Config.report;

      switch (interaction.values[0]) {
        case 'category-report-general': {
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-reportCh')
              .setLabel('送信先')
              .setEmoji('966588719635267624')
              .setStyle(discord.ButtonStyle.Secondary),
          );
          break;
        }
        case 'category-report-roleMention': {
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-reportRoleMention')
              .setLabel(settingSwitcher('BUTTON_LABEL', report.mention))
              .setStyle(settingSwitcher('BUTTON_STYLE', report.mention))
              .setDisabled(settingSwitcher('BUTTON_DISABLE', report.mentionRole)),
            new discord.ButtonBuilder()
              .setCustomId('setting-reportRole')
              .setLabel('ロール')
              .setEmoji('966719258430160986')
              .setStyle(discord.ButtonStyle.Secondary),
          );
          break;
        }
      }

      interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
    }

    if (interaction.values[0].startsWith('category-log')) {
      const log = Config.log;

      switch (interaction.values[0]) {
        case 'category-log-general': {
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-log')
              .setLabel(settingSwitcher('BUTTON_LABEL', log.enable))
              .setStyle(settingSwitcher('BUTTON_STYLE', log.enable))
              .setDisabled(settingSwitcher('BUTTON_DISABLE', log.channel)),
            new discord.ButtonBuilder()
              .setCustomId('setting-logCh')
              .setLabel('送信先')
              .setEmoji('966588719635267624')
              .setStyle(discord.ButtonStyle.Secondary),
          );

          interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
          break;
        }
        case 'category-log-event': {
          const logEventSelect = new discord.ActionRowBuilder().addComponents(
            new discord.SelectMenuBuilder()
              .setCustomId('setting-logEvents')
              .setMaxValues(4)
              .setPlaceholder('有効にしたいイベントを選択')
              .setOptions(
                { label: `${interaction.client.user.username}`, description: 'BOTのエラー等', value: 'bot', emoji: '966596708484149289' },
                { label: 'タイムアウト', value: 'timeout', emoji: '969148338597412884' },
                { label: 'Kick', value: 'kick', emoji: '969148338597412884' },
                { label: 'BAN', value: 'ban', emoji: '969148338597412884' },
              ),
          );
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-logEvents-removeAll')
              .setLabel('全てのイベントを無効')
              .setStyle(discord.ButtonStyle.Danger)
              .setDisabled(settingSwitcher('BUTTON_DISABLE', interaction.message.embeds[0].fields[1].value !== 'なし')),
          );

          interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, logEventSelect, button] });
          break;
        }
      }
    }

    if (interaction.values[0].startsWith('category-verification')) {
      const verification = Config.verification;

      switch (interaction.values[0]) {
        case 'category-verification-general': {
          button.addComponents(
            new discord.ButtonBuilder()
              .setCustomId('setting-verification')
              .setLabel(settingSwitcher('BUTTON_LABEL', verification.enable))
              .setStyle(settingSwitcher('BUTTON_STYLE', verification.enable))
              .setDisabled(settingSwitcher('BUTTON_DISABLE', verification.newLevel && verification.startChangeTime !== null && verification.endChangeTime !== null)),
            new discord.ButtonBuilder()
              .setCustomId('setting-startChangeTime')
              .setLabel('開始時刻')
              .setEmoji('1014603109001085019')
              .setStyle(discord.ButtonStyle.Secondary),
            new discord.ButtonBuilder()
              .setCustomId('setting-endChangeTime')
              .setLabel('終了時刻')
              .setEmoji('1014603109001085019')
              .setStyle(discord.ButtonStyle.Secondary),
          );

          interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, button] });
          break;
        }
        case 'category-verification-level': {
          const logEventSelect = new discord.ActionRowBuilder().addComponents(
            new discord.SelectMenuBuilder()
              .setCustomId('setting-newLevel')
              .setOptions(
                { label: '低', description: 'メール認証がされているアカウントのみ', value: '1', emoji: '🟢', default: verification.newLevel == 1 },
                { label: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ', value: '2', emoji: '🟡', default: verification.newLevel == 2 },
                { label: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ', value: '3', emoji: '🟠', default: verification.newLevel == 3 },
                { label: '最高', description: '電話認証がされているアカウントのみ', value: '4', emoji: '🔴', default: verification.newLevel == 4 },
              ),
          );

          interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, logEventSelect, button] });
          break;
        }
      }
    }

    if (!interaction.values?.[0]) interaction.update({});
  },
};

module.exports = [ selectMenuInteraction_featureCategory, selectMenuInteraction_settingCategory ];