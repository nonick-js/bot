import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentEmojiResolvable, ComponentType, EmbedBuilder, Interaction, InteractionReplyOptions, Message, MessageCreateOptions, TextBasedChannel } from 'discord.js';

export class EmbedPagination {
  #pages: EmbedBuilder[];
  #previousButton: ButtonBuilder;
  #nextButton: ButtonBuilder;
  #current: number;
  #senderOnly: boolean;
  #sended: boolean;

  constructor(...pages: EmbedBuilder[]) {
    this.#pages = pages ?? [];

    this.#previousButton = new ButtonBuilder()
      .setCustomId('pagination:previousButton')
      .setEmoji('◀️')
      .setStyle(ButtonStyle.Secondary),
      this.#nextButton = new ButtonBuilder()
        .setCustomId('pagination:nextButton')
        .setEmoji('▶')
        .setStyle(ButtonStyle.Secondary);

    this.#current = 0;
    this.#senderOnly = true;
    this.#sended = false;
  }

  #sendedTest() {
    if (this.#sended) throw new Error('This message sended!');
  }

  /** メッセージを送信した本人のみボタンを使用できるようにするか */
  useSenderOnly(only: boolean) {
    this.#sendedTest();
    this.#senderOnly = only;
    return this;
  }

  /** 戻るボタンのラベルを設定 */
  setPreviousButtonSetLabel(label: string) {
    this.#sendedTest();
    this.#previousButton.setLabel(label);
    return this;
  }
  /** 戻るボタンの絵文字を設定 */
  setPreviousButtonSetEmoji(emoji: ComponentEmojiResolvable) {
    this.#sendedTest();
    this.#previousButton.setEmoji(emoji);
    return this;
  }
  /** 戻るボタンのスタイルを設定 */
  setPreviousButtonSetStyle(style: ButtonStyle) {
    this.#sendedTest();
    this.#previousButton.setStyle(style);
    return this;
  }

  /** 進むボタンのラベルを設定 */
  setNextButtonSetLabel(label: string) {
    this.#sendedTest();
    this.#nextButton.setLabel(label);
    return this;
  }
  /** 進むボタンの絵文字を設定 */
  setNextButtonSetEmoji(emoji: ComponentEmojiResolvable) {
    this.#sendedTest();
    this.#nextButton.setEmoji(emoji);
    return this;
  }
  /** 進むボタンのスタイルを設定 */
  setNextButtonSetStyle(style: ButtonStyle) {
    this.#sendedTest();
    this.#nextButton.setStyle(style);
    return this;
  }

  /** ページを追加する */
  addPage(page: EmbedBuilder) {
    this.#sendedTest();
    this.#pages.push(page);
    return this;
  }
  /** 複数のページを追加する */
  addPages(...pages: EmbedBuilder[]) {
    this.#sendedTest();
    this.#pages.push(...pages);
    return this;
  }

  /** 送信する */
  async sendMessage(channel: TextBasedChannel, options: MessageCreateOptions = {}, message?: Message) {
    if (!this.#pages.length) throw new Error('pages length 0');

    const currentEmbed = this.#pages[this.#current];
    const msg = await channel.send({
      embeds: [...(options.embeds || []), currentEmbed.setFooter({ text: `${currentEmbed.data.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })],
      components: [...(options.components || []), new ActionRowBuilder<ButtonBuilder>().addComponents(this.#previousButton, this.#nextButton)],
      ...options,
    });
    this.#sended = true;

    const collector = msg.createMessageComponentCollector({
      filter: v => v.customId === 'pagination:previousButton' || v.customId === 'pagination:nextButton',
      componentType: ComponentType.Button,
      time: 300_000,
    });

    collector.on('collect', async i => {
      if (!message) return;
      if (this.#senderOnly && !i.user.equals(message.author)) return;

      if (i.customId === 'pagination:previousButton') this.#current = (this.#pages.length + --this.#current) % this.#pages.length;
      if (i.customId === 'pagination:nextButton') this.#current = ++this.#current % this.#pages.length;

      const embed = this.#pages[this.#current];
      await i.deferUpdate();
      await i.editReply({ embeds: [embed.setFooter({ text: `Page ${this.#current + 1} / ${this.#pages.length}` })] });
      collector.resetTimer();
    });

    collector.on('end', () => {
      if (!msg) return;
      msg.edit({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            this.#previousButton.setDisabled(true),
            this.#nextButton.setDisabled(true),
          ),
        ],
      });
    });

  }

  async replyMessage(message: Message, options: MessageCreateOptions = {}) {
    options.reply = { messageReference: options.reply?.messageReference ?? message, failIfNotExists: options.reply?.failIfNotExists };
    await this.sendMessage(message.channel, options, message);
  }

  async replyInteraction(interaction: Interaction, options: InteractionReplyOptions = {}) {
    if (!interaction.isRepliable()) throw new Error('interaction can\'t reply');
    if (!this.#pages.length) throw new Error('pages length 0');

    const currentEmbed = this.#pages[this.#current];
    const msg = await interaction.reply({
      embeds: [...(options.embeds || []), currentEmbed.setFooter({ text: `${currentEmbed.data.footer?.text || ''}Page ${this.#current + 1} / ${this.#pages.length}` })],
      components: [...(options.components || []), new ActionRowBuilder<ButtonBuilder>().addComponents(this.#previousButton, this.#nextButton)],
      fetchReply: true,
    });
    this.#sended = true;

    const collector = msg.createMessageComponentCollector({
      filter: v => v.customId === 'pagination:previousButton' || v.customId === 'pagination:nextButton',
      componentType: ComponentType.Button,
      time: 300_000,
    });

    collector.on('collect', async i => {
      if (this.#senderOnly && !i.user.equals(interaction.user)) return;

      if (i.customId === 'pagination:previousButton') this.#current = (this.#pages.length + --this.#current) % this.#pages.length;
      if (i.customId === 'pagination:nextButton') this.#current = ++this.#current % this.#pages.length;

      const embed = this.#pages[this.#current];
      await i.update({ embeds: [embed.setFooter({ text: `Page ${this.#current + 1} / ${this.#pages.length}` })] });
      collector.resetTimer();
    });

    collector.on('end', () => {
      if (!msg) return;
      msg.edit({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            this.#previousButton.setDisabled(true),
            this.#nextButton.setDisabled(true),
          ),
        ],
      });
    });
  }

}