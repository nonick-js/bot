import { ModerateSetting } from '@models';
import { DiscordEventBuilder } from '@modules/events';
import {
  Colors,
  EmbedBuilder,
  Events,
  TextChannel,
  escapeSpoiler,
  spoiler,
} from 'discord.js';
import type { GuildBasedChannel, Message } from 'discord.js';
import { langs } from 'lang';
import { LangTemplate } from 'lang/template';

const create = new DiscordEventBuilder({
  type: Events.MessageCreate,
  execute: autoMod,
});

const update = new DiscordEventBuilder({
  type: Events.MessageUpdate,
  async execute(_, message) {
    autoMod(await message.fetch());
  },
});

export default [create, update];

async function autoMod(message: Message) {
  if (!message.inGuild()) return;

  const { autoMod: setting } =
    (await ModerateSetting.findOne({ serverId: message.guild.id })) ?? {};
  if (!setting?.enable) return;
  if (
    setting.ignore.channels.includes(message.channel.id) ||
    message.member?.roles.cache?.some((role) =>
      setting.ignore.roles.includes(role.id),
    )
  )
    return;
  const channel =
    setting.log.enable && setting.log.channel
      ? await message.guild.channels.fetch(setting.log.channel)
      : null;

  if (setting.filter.inviteUrl) {
    const match = message.content.match(
      /(https?:\/\/)?(.*\.)?discord(app)?\.(gg|com\/invite)\/(?<code>\w+)/,
    );
    if (match?.groups?.code) {
      const invites = await message.guild.invites.fetch();
      if (invites.has(match.groups.code))
        deleteMessage(message, channel, 'label.autoMod.rule.inviteUrl');
    }
  }

  if (
    setting.filter.token &&
    (/mfa\.[a-z0-9_-]{20,}/i.test(message.content) ||
      /[a-z0-9_-]{23,28}\.[a-z0-9_-]{6,7}\.[a-z0-9_-]{27}/i.test(
        message.content,
      ))
  ) {
    deleteMessage(message, channel, 'label.autoMod.rule.token');
  }

  if (
    setting.filter.domain.enable &&
    setting.filter.domain.list.some((domain) =>
      message.content.includes(domain),
    )
  )
    deleteMessage(message, channel, 'label.autoMod.rule.domain');
}

function deleteMessage(
  message: Message<true>,
  channel: GuildBasedChannel | null,
  rule: keyof LangTemplate,
) {
  message.delete().then(() => {
    if (channel instanceof TextChannel) {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(langs.tl('moderate.autoMod.title'))
            .setDescription(
              [
                langs.tl('fields.channel', message.channel),
                langs.tl('fields.member', message.author, 'label.sender'),
                langs.tl('fields.schedule', message.createdAt, 'label.sendAt'),
              ].join('\n'),
            )
            .setColor(Colors.DarkButNotBlack)
            .setThumbnail(message.author.displayAvatarURL())
            .setFields(
              {
                name: langs.tl('label.message'),
                value: spoiler(escapeSpoiler(message.content)),
              },
              {
                name: langs.tl('label.rule'),
                value: langs.tl(rule),
              },
            ),
        ],
      });
    }
  });
}
