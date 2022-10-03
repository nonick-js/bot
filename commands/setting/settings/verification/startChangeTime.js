const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');
const { settingSwitcher } = require('../../../../modules/settingStatusSwitcher');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'setting-startChangeTime',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const modal = new discord.ModalBuilder()
      .setCustomId('setting-verificationTime')
      .setTitle('自動認証レベル変更')
      .setComponents(
        new discord.ActionRowBuilder().setComponents(
          new discord.TextInputBuilder()
            .setCustomId('startChangeTime')
            .setLabel('開始時刻 ※時間単位 (0 ~ 23)')
            .setMaxLength(2)
            .setStyle(discord.TextInputStyle.Short),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
  data: {
    customId: 'setting-endChangeTime-modal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    const time = interaction.fields.getTextInputValue('time');

    const embed = interaction.message.embeds[0];
    const button = interaction.message.components[1];

    const Config = await Configs.findOne({ serverId: interaction.guildId });

    try {
      if (isNaN(Number(time)) || Math.sign(time) == -1 || Number(time) > 23) throw '無効な値です！';
      if (Number(time) == Config.verification.startChangeTime) throw '開始時刻と同じ時間に設定することはできません！';
    }
    catch (err) {
      const errorEmbed = new discord.EmbedBuilder()
        .setAuthor({ name: err, iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.update({ embeds: [embed, errorEmbed] });
    }

    Config.verification.endChangeTime = Number(time);
		await Config.save({ wtimeout: 1500 });

    const status = (Config.verification.startChangeTime !== null ? `**${Config.verification.startChangeTime}:00**` : '未設定') + ' ～ ' + (Config.verification.endChangeTime !== null ? `**${Config.verification.endChangeTime}:00**` : '未設定');
    interaction.message.embeds[0].fields[1].value = status;

    button.components[1] = discord.ButtonBuilder.from(button.components[1])
      .setDisabled(settingSwitcher('BUTTON_DISABLE', Config.verification.newLevel && Config.verification.startChangeTime !== null && Config.verification.endChangeTime !== null));

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], button] });
  },
};

module.exports = [ buttonInteraction, modalInteraction ];