const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { welcomeM_preview } = require('../../../../modules/messageSyntax');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-welcomeMessage',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
		const Config = await Configs.findOne({ serverId: interaction.guildId });

    const modal = new discord.ModalBuilder()
      .setCustomId('setting-welcomeMessage-modal')
      .setTitle('入室ログメッセージ')
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('message')
            .setLabel('入室ログに表示するメッセージ')
            .setPlaceholder('各テキストのマークアップは公式ドキュメントを参照してください')
            .setMaxLength(3000)
            .setValue(Config.welcome.message)
            .setStyle(discord.TextInputStyle.Paragraph)
            .setRequired(true),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'setting-welcomeMessage-modal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const message = interaction.fields.getTextInputValue('message');

		const embed = interaction.message.embeds[0];

    const Config = await Configs.findOne({ serverId: interaction.guildId });
    Config.welcome.message = message;
		await Config.save({ wtimeout: 3000 });

		embed.fields[0].value = settingSwitcher('STATUS_CH', Config.welcome.enable, Config.welcome.channel) + `\n\n> ${welcomeM_preview(Config.welcome.message).split('\n').join('\n> ')}`;

		interaction.update({ embeds: [embed] });
	},
};

module.exports = [ buttonInteraction, modalInteraction ];