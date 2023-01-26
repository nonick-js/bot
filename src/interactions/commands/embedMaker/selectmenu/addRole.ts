import { ActionRowBuilder, APISelectMenuOption, ComponentType, GuildEmoji, ModalBuilder, Role, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Button, Modal } from '@akki256/discord-interaction';

const addRoleButton = new Button(
  { customId: 'nonick-js:embedMaker-selectRole-addRole' },
  async (interaction): Promise<void> => {

    const firstComponent = interaction.message.components[0].components[0];

    if (firstComponent.type == ComponentType.StringSelect && firstComponent.options.length == 25) {
      interaction.reply({ content: '`❌` これ以上ロールを追加することはできません！' });
      return;
    }

    interaction.showModal(
      new ModalBuilder()
      .setCustomId('nonick-js:embedMaker-selectRole-addRoleModal')
      .setTitle('パネルにロールを追加')
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('roleNameOrId')
            .setLabel('ロールの名前またはID')
            .setMaxLength(100)
            .setStyle(TextInputStyle.Short),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('displayName')
            .setLabel('セレクトメニュー上での表示名')
            .setPlaceholder('例: マイクラ勢')
            .setMaxLength(25)
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('description')
            .setLabel('ロールについての説明')
            .setPlaceholder('例: minecraftを遊んでいるユーザーにおすすめ！')
            .setMaxLength(50)
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('emojiNameOrId')
            .setLabel('Unicode絵文字 または カスタム絵文字')
            .setPlaceholder('一文字のみ・カスタム絵文字は名前かIDを入力')
            .setMaxLength(32)
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
        ),
      ),
    );

  },
);

const addRoleModal = new Modal(
  { customId: 'nonick-js:embedMaker-selectRole-addRoleModal' },
  (interaction): void => {

    if (!interaction.isFromMessage() || !interaction.inCachedGuild()) return;

    const roleNameOrId = interaction.fields.getTextInputValue('roleNameOrId');
    const emojiNameOrId = interaction.fields.getTextInputValue('emojiNameOrId');

    const emojiRegex = new RegExp(/\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu);
    const role = interaction.guild?.roles.cache.find(v => v.name == roleNameOrId || v.id == roleNameOrId);
    const emoji = interaction.guild.emojis.cache.find(v => v.name == emojiNameOrId) || emojiNameOrId.match(emojiRegex)?.[0];

    if (!(role instanceof Role)) {
      interaction.reply({ content: '`❌` 入力された値に一致するロールが見つかりませんでした。', ephemeral: true });
      return;
    }
    else if (role?.managed) {
      interaction.reply({ content: '`❌` そのロールは外部サービスによって管理されているため、セレクトメニューに追加できません。', ephemeral: true });
      return;
    }

    const newOption: APISelectMenuOption = {
      label: interaction.fields.getTextInputValue('displayName') || role.name.length > 25 ? role.name.substring(0, 25) : role.name,
      description: interaction.fields.getTextInputValue('displayName') || undefined,
      value: role.id,
      emoji: emoji ? ((emoji instanceof GuildEmoji) ? { id: emoji.id, animated: emoji.animated ?? undefined } : { name: emoji }) : undefined,
    };

    if (interaction.message.components[0].components[0].type !== ComponentType.StringSelect) {
      interaction.update({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            new StringSelectMenuBuilder()
              .setCustomId('nonick-js:embedMaker-roleSelectMenuInteraction')
              .setOptions(newOption),
          ),
          interaction.message.components[0],
        ],
      });
    }
    else {
      interaction.update({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
            StringSelectMenuBuilder
              .from(interaction.message.components[0].components[0])
              .setOptions(interaction.message.components[0].components[0].options.filter(v => v.value !== newOption.value).concat(newOption)),
          ),
          interaction.message.components[1],
        ],
      });
    }

  },
);

module.exports = [addRoleButton, addRoleModal];