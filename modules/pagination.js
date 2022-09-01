const discord = require('discord.js');
class Pagination {
	#pages
	#previousButton
	#nextButton
	#current
	#senderOnly
	#sended
	/**
	 * @constructor
	 * @param {discord.EmbedBuilder[]} pages ページ
	 */
	constructor(...pages) {
		/**
		 * @type {discord.EmbedBuilder[]}
		 */
		this.#pages = pages ?? [];
		/**
		 * @type {discord.ButtonBuilder}
		 */
		this.#previousButton = new discord.ButtonBuilder()
			.setCustomId('pagination:previousButton')
			.setEmoji('◀️')
			.setStyle(discord.ButtonStyle.Secondary);
		/**
		 * @type {discord.ButtonBuilder}
		 */
		this.#nextButton = new discord.ButtonBuilder()
			.setCustomId('pagination:nextButton')
			.setEmoji('▶')
			.setStyle(discord.ButtonStyle.Secondary);
		/**
		 * @type {number}
		 */
		this.#current = 0;
		/**
		 * @type {boolean}
		 */
		this.#senderOnly = true;
		/**
		 * @type {boolean}
		 */
		this.#sended = false;
	}

	#sendedTest() {
		if(this.#sended) throw new Error('This message sended!');
	}

	/**
	 * メッセージを送った本人のみ使えるようにするか
	 * @param {boolean} only
	 */
	useSenderOnly(only) {
		this.#sendedTest();
		this.#senderOnly = only;
		return this;
	}

	/**
	 * 戻るボタンのラベル
	 * @param {string} label
	 */
	setPreviousButtonSetLabel(label) {
		this.#sendedTest();
		this.#previousButton.setLabel(label);
		return this;
	}

	/**
	 * 戻るボタンの絵文字
	 * @param {discord.EmojiIdentifierResolvable} emoji
	 */
	setPreviousButtonSetEmoji(emoji) {
		this.#sendedTest();
		this.#previousButton.setEmoji(emoji);
		return this;
	}

	/**
	 * 戻るボタンのスタイル
	 * @param {discord.ButtonStyle} style
	 */
	setPreviousButtonSetStyle(style) {
		this.#sendedTest();
		this.#previousButton.setStyle(style);
		return this;
	}

	/**
	 * 進むボタンのラベル
	 * @param {string} label
	 */
	setNextButtonSetLabel(label) {
		this.#sendedTest();
		this.#nextButton.setLabel(label);
		return this;
	}

	/**
	 * 進むボタンの絵文字
	 * @param {discord.EmojiIdentifierResolvable} emoji
	 */
	setNextButtonSetEmoji(emoji) {
		this.#sendedTest();
		this.#nextButton.setEmoji(emoji);
		return this;
	}

	/**
	 * 進むボタンのスタイル
	 * @param {discord.ButtonStyle} style
	 */
	setNextButtonSetStyle(style) {
		this.#sendedTest();
		this.#nextButton.setStyle(style);
		return this;
	}

	/**
	 * ページを追加する
	 * @param {discord.EmbedBuilder} page ページ
	 */
	addPage(page) {
		this.#sendedTest();
		this.#pages.push(page);
		return this;
	}

	/**
	 * 複数のページを追加する
	 * @param {discord.EmbedBuilder[]} pages ページ
	 */
	addPages(...pages) {
		this.#sendedTest();
		this.#pages.push(...pages);
		return this;
	}

	/**
	 * 送信する
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
		this.#sended = true;
		const filter = (i) => i.customId === 'pagination:previousButton' || i.customId === 'pagination:nextButton';
		const collector = msg.createMessageComponentCollector({
			filter, time: 600_000
		});
		collector.on('collect', async i => {
			if(!message) return
			if(this.#senderOnly && !i.user.equals(message.author)) return;
			if(i.customId === 'pagination:previousButton') {
				this.#current = (this.#pages.length + --this.#current) % this.#pages.length;
			}
			if(i.customId === 'pagination:nextButton') {
				this.#current = ++this.#current % this.#pages.length;
			}
			const embed = this.#pages[this.#current];
			await i.deferUpdate();
			await i.editReply({
				embeds: [embed.setFooter({ ...embed.footer, text: `${embed.footer?.text || ''}Page ${this.current + 1} / ${this.pages.length}` })]
			});
			collector.resetTimer();
		});
		collector.on('end', () => {
			if(msg) {
				msg.edit({
					components: msg.components.map(row => row.components.map(button => filter(button) ? discord.ButtonBuilder.from(button).setDisabled(true) : button))
				});
			}
		});
	}

	/**
	 * @param {discord.Message} message
	 * @param {discord.MessageOptions} options
	 */
	async replyMessage(message, options = {}) {
		options.reply = { messageReference: options.reply?.messageReference ?? message, failIfNotExists: options.reply?.failIfNotExists}
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
		this.#sended = true;
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
			const embed = this.#pages[this.#current];
			i.update({
				embeds: [embed.setFooter({ ...embed.footer, text: `${embed.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })]
			});
			collector.resetTimer();
		});
	}
}

module.exports = Pagination;
