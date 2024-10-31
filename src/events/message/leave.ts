import { joinAndLeaveHolder } from '@const/holder';
import { LeaveMessageConfig } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { Events, type MessageCreateOptions } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildMemberRemove,
  async execute(member) {
    const setting = await LeaveMessageConfig.findOne({
      guildId: member.guild.id,
    });
    if (!setting?.enabled) return;
    if (setting.ignoreBot && member.user.bot) return;
    const channel = setting.channel
      ? await member.guild.channels.fetch(setting.channel).catch(() => null)
      : null;
    if (channel?.isTextBased()) {
      channel.send(
        joinAndLeaveHolder.parse(setting.message as MessageCreateOptions, {
          guild: member.guild,
          user: member.user,
        }),
      );
    }
  },
});
