const discord = require('discord.js');
const Configs = require('../../../../schemas/configSchema');

/** @type {import('@djs-tools/interactions').SelectMenuRegister} */
const commandInteraction = {
  data: {
    customId: 'setting-newLevel',
    type: 'SELECT_MENU',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];
		const options = interaction.component.options.map(v => ({ label: v.label, value: v.value, emoji: v.emoji, default: v.value == Number(interaction.values) }));
		const select = new discord.ActionRowBuilder().addComponents(discord.SelectMenuBuilder.from(interaction.component).setOptions(options));

    const levelData = [
      '`🟢` **低** `メール認証がされているアカウントのみ`',
      '`🟡` **中** `Discordに登録してから5分以上経過したアカウントのみ`',
      '`🟠` **高** `このサーバーのメンバーとなってから10分以上経過したメンバーのみ`',
      '`🔴` **最高** `電話認証がされているアカウントのみ`',
    ];

		const Config = await Configs.findOne({ serverId: interaction.guildId });
		Config.verification.newLevel = Number(interaction.values);
		await Config.save({ wtimeout: 1500 });

    embed.fields[2].value = levelData[Number(interaction.values) - 1];

    interaction.update({ embeds: [embed], components: [interaction.message.components[0], select, interaction.message.components[2] ] });
  },
};
module.exports = [ commandInteraction ];