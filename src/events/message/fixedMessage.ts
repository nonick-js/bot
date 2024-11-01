import { FixedMessageConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { Events, type MessageCreateOptions } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild() || message.author.equals(message.client.user))
      return;
    const setting = await FixedMessageConfig.findOne({
      guildId: message.guild.id,
      channel: message.channel.id,
    });

    if (!setting?.enabled) return;

    if (setting.last) {
      const beforeMsg = await message.channel.messages
        .fetch(setting.last)
        .catch(() => null);
      beforeMsg?.delete();
    }

    message.channel
      .send({
        content: setting.message.content,
        embeds: setting.message.embeds as MessageCreateOptions['embeds'],
      })
      .then((msg) => {
        setting.last = msg.id;
        setting.save();
      })
      .catch(() => {
        setting.enabled = false;
        setting.save();
      });
  },
});
