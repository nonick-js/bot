import { joinAndLeaveHolder } from '@const/placeholder';
import { MessageSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { setLang } from '@modules/utils';
import { Events, TextChannel } from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildMemberRemove,
  async execute(member) {
    const { leave: setting } =
      (await MessageSetting.findOne({ serverId: member.guild.id })) ?? {};
    if (!setting?.enable) return;
    if (!setting.includeBot && member.user.bot) return;
    const channel = await member.guild.channels.fetch(setting.channel);
    await setLang(member.guild.id);
    if (channel instanceof TextChannel) {
      channel.send(
        joinAndLeaveHolder.parse(setting.messageOption, {
          guild: member.guild,
          user: member.user,
        }),
      );
    }
  },
});
