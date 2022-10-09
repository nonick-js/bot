const discord = require('discord.js');
const { memberRoleCheck } = require('../../../modules/valueCheck');

/** @type {import('@djs-tools/interactions').ButtonRegister} */
const buttonInteraction = {
  data: {
    customId: 'reactionRole-addRole',
    type: 'BUTTON',
  },
  exec: async (interaction) => {
    /** @type {discord.Embed} */
    /** @type {discord.ActionRowComponent} */
    const select = interaction.message.components[0].components[0];

    if (select.type == discord.ComponentType.SelectMenu && select.options.length == 25) {
      const error = new discord.EmbedBuilder()
        .setAuthor({ name: 'これ以上ロールを追加できません！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
        .setColor('Red');
      return interaction.update({ embeds: [interaction.message.embeds[0], error] });
    }

    const modal = new discord.ModalBuilder()
      .setCustomId('reactionRole-addRoleModal')
      .setTitle('ロールを追加')
      .addComponents(
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('name')
            .setLabel('ロールの名前')
            .setMaxLength(100)
            .setStyle(discord.TextInputStyle.Short),
        ),
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('displayName')
            .setLabel('表示名')
            .setMaxLength(100)
            .setStyle(discord.TextInputStyle.Short)
            .setRequired(false),
        ),
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('description')
            .setLabel('説明')
            .setMaxLength(100)
            .setStyle(discord.TextInputStyle.Short)
            .setRequired(false),
          ),
        new discord.ActionRowBuilder().addComponents(
          new discord.TextInputBuilder()
            .setCustomId('emoji')
            .setLabel('Unicode絵文字・カスタム絵文字')
            .setPlaceholder('カスタム絵文字は絵文字名で入力してください')
            .setMaxLength(32)
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
    customId: 'reactionRole-addRoleModal',
    type: 'MODAL',
  },
  exec: async (interaction) => {
    /** @type {discord.ActionRow} */
    const component = interaction.message.components[0];

    const regexp = new RegExp(/\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu);
    const displayName = interaction.fields.getTextInputValue('displayName');
    const description = interaction.fields.getTextInputValue('description') || undefined;

    const unicodeEmoji = interaction.fields.getTextInputValue('emoji').match(regexp);
    const emoji = interaction.guild.emojis.cache.find((v) => v.name === interaction.fields.getTextInputValue('emoji'));
    const role = interaction.guild.roles.cache.find((v) => v.name === interaction.fields.getTextInputValue('name'));

    await memberRoleCheck(role, interaction);
    if (interaction.replied) return;

    if (component.components[0].type == discord.ComponentType.Button) {
      const select = new discord.ActionRowBuilder().addComponents(
        new discord.SelectMenuBuilder()
          .setCustomId('reactionRole')
          .setMinValues(0)
          .setOptions({ label: displayName || role?.name, description: description, value: role.id, emoji: unicodeEmoji?.[0] ?? emoji?.id }),
        );
      interaction.update({ embeds: [interaction.message.embeds[0]], components: [select, component] });
    } else {
      if (component.components[0].options.find((v) => v.value == role.id)) {
        const embed = new discord.EmbedBuilder()
          .setAuthor({ name: 'そのロールは既に追加されています！', iconURL: 'https://cdn.discordapp.com/attachments/958791423161954445/1022819275456651294/mark_batsu_illust_899.png' })
          .setColor('Red');
        return interaction.update({ embeds: [interaction.message.embeds[0], embed] });
      }
      component.components[0] = discord.SelectMenuBuilder.from(component.components[0]).addOptions({ label: displayName || role?.name, description: description, value: role.id, emoji: unicodeEmoji?.[0] ?? emoji?.id }),
      interaction.update({ embeds: [interaction.message.embeds[0]], components: [component, interaction.message.components[1] ] });
    }
  },
};

module.exports = [ buttonInteraction, modalInteraction ];