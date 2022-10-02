// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole-editEmbed',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    const embed = interaction.message.embeds[0];

    const modal = new discord.ModalBuilder()
      .setCustomId('reactionRole-editEmbedModal')
      .setTitle('埋め込みの編集')
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('title')
            .setLabel('タイトル')
            .setMaxLength(1000)
            .setValue(embed.title)
            .setStyle(discord.TextInputStyle.Short),
        ),
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('description')
            .setLabel('説明')
            .setMaxLength(4000)
            .setValue(embed?.description || '')
            .setStyle(discord.TextInputStyle.Paragraph)
            .setRequired(false),
        ),
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('color')
            .setLabel('カラーコード')
            .setMaxLength(7)
            .setPlaceholder('#ffffff')
            .setValue(embed.hexColor || '')
            .setStyle(discord.TextInputStyle.Short),
        ),
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('image')
            .setLabel('埋め込み内画像に設定するURL')
            .setMaxLength(1000)
            .setValue(embed.image?.url || '')
            .setStyle(discord.TextInputStyle.Short)
            .setRequired(false),
        ),
      );

    interaction.showModal(modal);
  },
};

/** @type {import('@djs-tools/interactions').ModalRegister} */
const modalInteraction = {
	data: {
		customId: 'reactionRole-editEmbedModal',
		type: 'MODAL',
	},
	exec: async (interaction) => {
		const title = interaction.fields.getTextInputValue('title');
		const description = interaction.fields.getTextInputValue('description');
		const color = interaction.fields.getTextInputValue('color')?.match(new RegExp(/^#[0-9A-Fa-f]{6}$/, 'g'));
		const image = interaction.fields.getTextInputValue('image');

		const embed = discord.EmbedBuilder.from(interaction.message.embeds[0])
			.setTitle(title)
			.setDescription(description || null)
			.setColor(color?.[0] || interaction.message.embeds[0].hexColor)
			.setImage(urlCheck(image));

		interaction.update({ embeds: [embed] });

		function urlCheck(param) {
			if (!param) return null;
			else if (param.startsWith('https://') || param.startsWith('http://')) return param;
			else return interaction.message.embeds[0][Object.keys({ param })[0]];
		}
	},
};

module.exports = [ buttonInteraction, modalInteraction ];