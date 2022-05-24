const discord = require('discord.js');
const btn = new discord.MessageActionRow().addComponents([
	new discord.MessageButton()
    	.setCustomId('previousbtn')
		.setEmoji('◀️')
		.setStyle('DANGER'),
	new discord.MessageButton()
  		.setCustomId('nextbtn')
		.setEmoji('▶')
  		.setStyle('SUCCESS')
]);
const dbtn = new discord.MessageActionRow().addComponents([
	new discord.MessageButton()
		.setDisabled(true)
		.setCustomId('previousbtn')
		.setEmoji('◀️')
		.setStyle('DANGER'),
	new discord.MessageButton()
		.setDisabled(true)
  		.setCustomId('nextbtn')
		.setEmoji('▶')
  		.setStyle('SUCCESS')
]);
module.exports = {
	/**
	 * 
	 * @param {discord.interaction} interaction 
	 * @param {discord.MessageEmbed[]} pages 
	 * @param {boolean} [ephemeral]
	 */
	interaction: async (interaction,pages,ephemeral=false) => {
		let currentPage = 0;
		const curPage = await interaction.reply({
    	embeds: [pages[currentPage].setFooter({text:`Page ${currentPage + 1} / ${pages.length}`})],
    	components: [btn],fetchReply: true,
			ephemeral: ephemeral
  	});
		const filter = (i) => i.customId === 'previousbtn' || i.customId === 'nextbtn';
		const collector = await curPage.createMessageComponentCollector({
   		filter, time: 600000,
  	});
		collector.on("collect", async (i) => {
			if(i.user.id === interaction.member.id) {
  	  	switch (i.customId) {
  	  	  case 'previousbtn':
  	  	    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
  	  	    break;
  	  	  case 'nextbtn':
  	  	    currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
  	  	    break;
  	  	}
  	  	await i.deferUpdate();
  	  	await i.editReply({
  	  	  embeds: [pages[currentPage].setFooter({text:`Page ${currentPage + 1} / ${pages.length}`})],
  	  	  components: [btn],
  	  	});
  	  	collector.resetTimer();
			}
  	});

  	collector.on("end", () => {
  	  if (!curPage.deleted) {
  	    curPage.edit({
  	      embeds: [pages[currentPage].setFooter({text:`Page ${currentPage + 1} / ${pages.length}`})],
  	      components: [dbtn],
  	    });
  	  }
  	});
	},
	/**
	 * 
	 * @param {discord.Message} message 
	 * @param {discord.MessageEmbed[]} pages 
	 */
	message: async (message,pages) => {
		let currentPage = 0;
		const curPage = await message.reply({
    	embeds: [pages[currentPage].setFooter({text:`Page ${currentPage + 1} / ${pages.length}`})],
    	components: [btn],fetchReply: true,
  	});
		const filter = (i) => i.customId === 'previousbtn' || i.customId === 'nextbtn';
		const collector = curPage.createMessageComponentCollector({
   		filter, time: 600000,
  	});
		collector.on("collect", async (i) => {
			if(i.user.id === message.author.id) {
  	  	switch (i.customId) {
  	  	  case 'previousbtn':
  	  	    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
  	  	    break;
  	  	  case 'nextbtn':
  	  	    currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
  	  	    break;
  	  	}
  	  	await i.deferUpdate();
  	  	await i.editReply({
  	  	  embeds: [pages[currentPage].setFooter({text:`Page ${currentPage + 1} / ${pages.length}`})],
  	  	  components: [btn],
  	  	});
  	  	collector.resetTimer();
			}
  	});

  	collector.on("end", () => {
  	  if(!!curPage) {
  	    curPage.edit({
  	      embeds: [pages[currentPage].setFooter({text:`Page ${currentPage + 1} / ${pages.length}`})],
  	      components: [dbtn],
  	    });
  	  }
  	});
	}
}