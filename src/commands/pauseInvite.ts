import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  GuildFeature,
  PermissionFlagsBits,
  codeBlock,
} from 'discord.js';
import { createDescription, langs } from 'lang';

export default new ChatInput(
  {
    name: 'pauseinvite',
    ...createDescription('commands.pauseinvite.description'),
    options: [
      {
        name: 'pause',
        ...createDescription('commands.pauseinvite.pause.description'),
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
  },
  { coolTime: Duration.toMS('50s') },
  (interaction) => {
    langs.setLang(interaction.locale);
    if (!interaction.inCachedGuild()) return;
    const pause = interaction.options.getBoolean('pause', true);
    const guildFeatures = interaction.guild.features;
    if (guildFeatures.includes(GuildFeature.InvitesDisabled) === pause)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(langs.tl('label.pauseinvite.failed.alreadyDone'))
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      });

    interaction.guild
      .edit(
        pause
          ? {
              features: [...guildFeatures, GuildFeature.InvitesDisabled],
              reason: langs.tl(
                'label.pauseinvite.reason.pause',
                interaction.user,
              ),
            }
          : {
              features: guildFeatures.filter(
                (v) => v !== GuildFeature.InvitesDisabled,
              ),
              reason: langs.tl(
                'label.pauseinvite.reason.enable',
                interaction.user,
              ),
            },
      )
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                langs.tl(
                  'label.pauseinvite.success',
                  pause
                    ? 'label.pauseinvite.pause'
                    : 'label.pauseinvite.enable',
                ),
              )
              .setColor(Colors.Green),
          ],
          ephemeral: true,
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                [langs.tl('label.pauseinvite.failed'), codeBlock(err)].join(
                  '\n',
                ),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      });
  },
);
