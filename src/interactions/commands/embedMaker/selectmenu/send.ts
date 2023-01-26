import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder } from 'discord.js';
import { Button } from '@akki256/discord-interaction';

const addRoleSelectButton = new Button(
  { customId: 'nonick-js:embedMaker-selectRole-sendComponent' },
  async (interaction): Promise<void> => {

    if (!interaction.inCachedGuild() || !interaction.channel) return;
    const roleSelect = interaction.message.components[0].components[0];
    const selectStatusButton = interaction.message.components[1].components[2];

    if (roleSelect.type !== ComponentType.StringSelect) {
      interaction.reply({ content: '`❌` セレクトメニューを作成していません！', ephemeral: true });
      return;
    }

    const webhook = (await interaction.guild.fetchWebhooks()).find(v => v.owner?.id == interaction.client.user.id);
    const targetId = interaction.message.embeds[0].footer?.text.match(/[0-9]{18,19}/)?.[0];
    const targetMessage = await (await interaction.channel.fetch()).messages.fetch(targetId!).catch(() => {});

    if (!targetMessage || !targetId) {
      interaction.reply({ content: '`❌` メッセージの取得中に問題が発生しました。', ephemeral: true });
      return;
    }
    else if (webhook?.id !== targetMessage.webhookId) {
      interaction.reply({ content: '`❌` このメッセージは更新できません。', ephemeral: true });
      return;
    }
    else if (targetMessage.components.length == 5) {
      interaction.reply({ content: '`❌` これ以上コンポーネントは追加できません！', ephemeral: true });
      return;
    }

    webhook
      ?.editMessage(targetMessage, { components: [
        ...targetMessage.components,
        new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
          StringSelectMenuBuilder
            .from(roleSelect.toJSON())
            .setCustomId(`${roleSelect.customId}-${targetMessage.components.length + 1}`)
            .setMaxValues(selectStatusButton.customId == 'nonick-js:embedMaker-selectRole-selectMode-multi' ? roleSelect.options.length : 1),
        ),
      ] })
      .then(() => interaction.update({ content: '`✅` コンポーネントを追加しました！', components: [interaction.message.components[1]] }))
      .catch(() => interaction.reply({ content: '`❌` コンポーネントの更新中に問題が発生しました。', ephemeral: true }));

  },
);

module.exports = [ addRoleSelectButton ];