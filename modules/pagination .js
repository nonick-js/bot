const discord = require('discord.js');
class Pagination {
	#pages
	#previousButton
	#nextButton
	#current
	#senderOnly
	/**
	 * @constructor
	 * @param {discord.MessageEmbed[]} pages
	 */
	constructor(...pages) {
		/**
		 * @type {discord.MessageEmbed[]}
		 */
		this.#pages = pages ?? [];
		/**
		 * @type {discord.ButtonBuilder}
		 */
		this.#previousButton = new discord.ButtonBuilder()
			.setCustomId('pagination:previousButton')
			.setLabel('Previous')
			.setEmoji('◀️')
			.setStyle(discord.ButtonStyle.Danger);
		/**
		 * @type {discord.ButtonBuilder}
		 */
		this.#nextButton = new discord.ButtonBuilder()
			.setCustomId('pagination:nextButton')
			.setLabel('Next')
			.setEmoji('▶')
			.setStyle(discord.ButtonStyle.Success);
		/**
		 * @type {number}
		 */
		this.#current = 0;
		/**
		 * @type {boolean}
		 */
		this.#senderOnly = true;
	}

	/**
	 * @param {boolean} only
	 */
	useSenderOnly(only) {
		this.#senderOnly = only;
		return this;
	}

	/**
	 * @param {string} label
	 */
	setPreviousButtonSetLabel(label) {
		this.#previousButton.setLabel(label);
		return this;
	}

	/**
	 * @param {discord.EmojiIdentifierResolvable} emoji
	 */
	setPreviousButtonSetEmoji(emoji) {
		this.#previousButton.setEmoji(emoji);
		return this;
	}

	/**
	 * @param {discord.ButtonStyle} style
	 */
	setPreviousButtonSetStyle(style) {
		this.#previousButton.setStyle(style);
		return this;
	}

	/**
	 * @param {string} label
	 */
	setNextButtonSetLabel(label) {
		this.#nextButton.setLabel(label);
		return this;
	}

	/**
	 * @param {discord.EmojiIdentifierResolvable} emoji
	 */
	setNextButtonSetEmoji(emoji) {
		this.#nextButton.setEmoji(emoji);
		return this;
	}

	/**
	 * @param {discord.ButtonStyle} style
	 */
	setNextButtonSetStyle(style) {
		this.#nextButton.setStyle(style);
		return this;
	}

	/**
	 * @param {discord.MessageEmbed} page
	 */
	addPage(page) {
		this.#pages.push(page);
		return this;
	}

	/**
	 * @param {discord.MessageEmbed[]} pages
	 */
	addPages(...pages) {
		this.#pages.push(...pages);
		return this;
	}

	/**
	 * @param {discord.DMChannel | discord.PartialDMChannel | discord.NewsChannel | discord.TextChannel | discord.ThreadChannel | discord.VoiceChannel} channel
	 * @param {discord.MessageOptions} options
	 * @param {discord.Message?} message
	 */
	async sendMessage(channel, options = {}, message = null) {
		if(!this.#pages.length) throw new Error('pages length 0');
		const currentEmbed = this.#pages[this.#current];
		const msg = await channel.send({
			...options,
			embeds: [...(options.embeds || []), currentEmbed.setFooter({ ...currentEmbed.footer, text: `${currentEmbed.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })],
			components: [...(options.components || []), new discord.ActionRowBuilder().addComponents(this.#previousButton, this.#nextButton)]
		});
		const filter = (i) => i.customId === 'pagination:previousButton' || i.customId === 'pagination:nextButton';
		const collector = msg.createMessageComponentCollector({
			filter, time: 600_000
		});
		collector.on('collect', async i => {
			if(this.#senderOnly && message && !i.user.equals(message.author)) return;
			if(i.customId === 'pagination:previousButton') {
				this.#current = (this.#pages.length + --this.#current) % this.#pages.length;
			}
			if(i.customId === 'pagination:nextButton') {
				this.#current = ++this.#current % this.#pages.length;
			}
			const embed = this.#pages[this.#current];
			await i.deferUpdate();
			await i.editReply({
				embeds: [embed.setFooter({ ...embed.footer, text: `${embed.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })]
			});
			collector.resetTimer();
		});
		collector.on('end',() => {
			if(msg) {
				msg.edit({
					components: msg.components.map(row => row.components.map(button => filter(button) ? button.setDisabled(true) : button))
				});
			}
		});
	}

	/**
	 * @param {discord.Message} message
	 * @param {discord.MessageOptions} options
	 */
	async replyMessage(message, options = {}) {
		options.reply.messageReference = options.reply?.messageReference ?? message;
		await this.sendMessage(message.channel, options, message);
	}

	/**
	 * @param {discord.Interaction} interaction
	 * @param {discord.InteractionReplyOptions} options
	 */
	async replyInteraction(interaction, options = {}) {
		if(!this.#pages.length) throw new Error('pages length 0');
		const currentEmbed = this.#pages[this.#current];
		const msg = await interaction.reply({
			...options,
			embeds: [...(options.embeds || []), currentEmbed.setFooter({ ...currentEmbed.footer, text: `${currentEmbed.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })],
			components: [...(options.components || []), new discord.ActionRowBuilder().addComponents(this.#previousButton, this.#nextButton)]
		});
		const filter = (i) => i.customId === 'pagination:previousButton' || i.customId === 'pagination:nextButton';
		const collector = msg.createMessageComponentCollector({
			filter, time: 600_000
		});
		collector.on('collect', async i => {
			if(this.#senderOnly && interaction && !i.user.equals(interaction.user)) return;
			if(i.customId === 'pagination:previousButton') {
				this.#current = (this.#pages.length + --this.#current) % this.#pages.length;
			}
			if(i.customId === 'pagination:nextButton') {
				this.#current = ++this.#current % this.#pages.length;
			}
			const embed = this.#pages[this.#current]
			await i.deferUpdate();
			await i.editReply({
				embeds: [embed.setFooter({ ...embed.footer, text: `${embed.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })]
			});
			collector.resetTimer();
		});
		collector.on('end',() => {
			if(msg) {
				msg.edit({
					components: msg.components.map(row => row.components.map(button => filter(button) ? button.setDisabled(true) : button))
				});
			}
		});
	}
}

module.exports = { Pagination };
