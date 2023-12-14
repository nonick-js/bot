import { MessageSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import { EmbedPagination, PaginationButton } from '@modules/pagination';
import { getMessage } from '@modules/utils';
import { ButtonStyle, Colors, EmbedBuilder, Events, time } from 'discord.js';
import { langs } from 'lang';

interface UrlMatchGroup {
  startPattern?: string;
  guildId?: string;
  channelId?: string;
  messageId?: string;
  endPattern?: string;
}

export default new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    const { expansion: setting } =
      (await MessageSetting.findOne({ serverId: message.guild.id })) ?? {};
    if (!setting?.enable) return;
    if (
      setting.ignore.types.includes(message.channel.type) ||
      setting.ignore.channels.includes(message.channel.id)
    )
      return;
    for (const url of message.content.matchAll(
      /(?<startPattern>.)?https?:\/\/(?:.+\.)?discord(?:.+)?.com\/channels\/(?<guildId>\d+)\/(?<channelId>\d+)\/(?<messageId>\d+)(?<endPattern>.)?/g,
    )) {
      const groups: UrlMatchGroup | undefined = url.groups;
      if (!(groups?.guildId && groups.channelId && groups.messageId)) continue;
      if (
        groups.startPattern &&
        setting.ignore.prefixes.includes(groups.startPattern)
      )
        continue;
      if (groups.startPattern === '<' && groups.endPattern === '>') continue;
      if (
        groups.guildId !== message.guild.id &&
        !(await MessageSetting.countDocuments({
          serverId: groups.guildId,
          'expansion.allowExternal': true,
        }))
      )
        continue;
      try {
        const msg = await getMessage(
          groups.guildId,
          groups.channelId,
          groups.messageId,
        );

        const pagination = new EmbedPagination();
        const infoEmbed = new EmbedBuilder()
          .setTitle(langs.tl('message.expansion.title'))
          .setURL(msg.url)
          .setColor(Colors.White)
          .setAuthor({
            name: msg.member?.displayName ?? msg.author.tag,
            iconURL:
              msg.member?.displayAvatarURL() ?? msg.author.displayAvatarURL(),
          })
          .addFields({
            name: langs.tl('label.sendAt'),
            value: time(msg.createdAt),
            inline: true,
          });
        const contentEmbeds = (msg.content.match(/.{1,1024}/gs) ?? []).map(
          (content) =>
            new EmbedBuilder(infoEmbed.toJSON()).setDescription(content),
        );
        const attachmentEmbeds = msg.attachments.map((attachment) =>
          new EmbedBuilder(infoEmbed.toJSON()).setImage(attachment.url),
        );
        if (!contentEmbeds.concat(attachmentEmbeds).length)
          pagination.addPages(infoEmbed);
        pagination
          .addPages(
            ...contentEmbeds,
            ...attachmentEmbeds,
            ...msg.embeds.map((v) => EmbedBuilder.from(v)),
          )
          .addButtons(
            EmbedPagination.previousButton,
            EmbedPagination.nextButton,
            new PaginationButton('pagination:delete')
              .setEmoji('🗑️')
              .setStyle(ButtonStyle.Danger)
              .setFunc((i) => {
                i.message.delete();
              }),
          )
          .replyMessage(message, { allowedMentions: { parse: [] } });
      } catch (err) {}
    }
  },
});
