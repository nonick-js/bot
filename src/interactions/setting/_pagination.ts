import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ChannelSelectMenuBuilder, ComponentType, Interaction, RoleSelectMenuBuilder, StringSelectMenuBuilder } from 'discord.js';
import ServerSettings, { IServerSettings } from '../../schemas/ServerSettings';

interface indexPageSelectOptions {
  name?: string,
  description?: string,
  emoji?: string,
}

type ActionRowBuilders = (
  ActionRowBuilder<ButtonBuilder> |
  ActionRowBuilder<StringSelectMenuBuilder> |
  ActionRowBuilder<ChannelSelectMenuBuilder> |
  ActionRowBuilder<RoleSelectMenuBuilder>
);

export class ControlPanelComponentPagination {
  options: (setting: IServerSettings | null) => Omit<BaseMessageOptions, 'components'>;
  components: ((setting: IServerSettings | null) => ActionRowBuilders[])[];
  readonly pageSelect: StringSelectMenuBuilder;
  #current: number;

  constructor(options?: (setting: IServerSettings | null) => Omit<BaseMessageOptions, 'components'>) {
    this.options = options || (() => ({}));
    this.components = [];
    this.pageSelect = new StringSelectMenuBuilder();
    this.#current = 0;
  }

  // コンポーネントを追加する
  addActionRows(component: (setting: IServerSettings | null) => ActionRowBuilders[], option: indexPageSelectOptions) {
    const index = this.pageSelect.options?.length || 0;

    this.components.push(component);
    this.pageSelect.addOptions({
      label: option.name || `ページ${index}`,
      value: String(index),
      description: option?.description,
      emoji: option?.emoji,
      default: index == 0,
    });
    return this;
  }

  // MessageOptionsを設定する
  setMessageOptions(options: (setting: IServerSettings | null) => Omit<BaseMessageOptions, 'components'>) {
    this.options = options;
    return this;
  }

  // メッセージに返信する
  async replyMessage(interaction: Interaction, ephemeral?: boolean) {
    if (!interaction.isRepliable()) throw new Error('interaction can\'t reply');
    if (!this.components.length) throw new Error('components length 0');
    await interaction.deferReply({ ephemeral: true });

    const currentComponents = this.components[this.#current];
    const Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

    const message = await interaction.followUp({
      ...this.options(Setting),
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(this.pageSelect.setCustomId('pagination:componentSelect')),
        ...currentComponents(Setting),
      ],
      fetchReply: true,
      ephemeral: !!ephemeral,
    });

    const collector = message.createMessageComponentCollector({
      filter: v => v.customId == 'pagination:componentSelect',
      componentType: ComponentType.StringSelect,
      time: 600_000,
    });

    collector.on('collect', async i => {
      this.#current = Number(i.values[0]);
      const i_CurrentComponents = this.components[this.#current];
      const i_Setting = await ServerSettings.findOne({ serverId: interaction.guildId });

      const newComponentSelect = StringSelectMenuBuilder
        .from(i.component)
        .setOptions(i.component.options.map(
          ({ label, value, description, emoji }) => ({ label, value, description, emoji, default: value == i.values[0] }),
        ));

      i.update({
        ...this.options(i_Setting),
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(newComponentSelect),
          ...i_CurrentComponents(i_Setting),
        ],
      });

      collector.resetTimer();
    });

    collector.on('end', () => {});
  }
}