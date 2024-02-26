import { Button, ChatInput } from '@akki256/discord-interaction';
import { Captcha } from '@modules/captcha';
import { Duration } from '@modules/format';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  GuildMemberRoleManager,
  PermissionFlagsBits,
} from 'discord.js';
import { createDescription, createName, langs } from 'lang';

const duringAuthentication = new Set<string>();

const verifyTypes = ['button', 'image'] as const;
type VerifyType = (typeof verifyTypes)[number];

const verifyCommand = new ChatInput(
  {
    name: 'verify',
    ...createDescription('commands.verify.description'),
    options: [
      {
        name: 'type',
        ...createDescription('commands.verify.type.description'),
        choices: verifyTypes.map((value) => ({
          ...createName(`commands.verify.type.${value}`),
          value,
        })),
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'role',
        ...createDescription('commands.verify.role.description'),
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
      {
        name: 'description',
        ...createDescription('commands.verify.description.description'),
        type: ApplicationCommandOptionType.String,
        maxLength: 4096,
      },
      {
        name: 'color',
        ...createDescription('commands.verify.color.description'),
        type: ApplicationCommandOptionType.Number,
        choices: [
          { ...createName('label.color.red'), value: Colors.Red },
          { ...createName('label.color.orange'), value: Colors.Orange },
          { ...createName('label.color.yellow'), value: Colors.Yellow },
          { ...createName('label.color.green'), value: Colors.Green },
          { ...createName('label.color.blue'), value: Colors.Blue },
          { ...createName('label.color.purple'), value: Colors.Purple },
          { ...createName('label.color.white'), value: Colors.White },
          { ...createName('label.color.black'), value: Colors.DarkButNotBlack },
        ],
      },
      {
        name: 'image',
        description: '画像',
        type: ApplicationCommandOptionType.Attachment,
      },
    ],
    defaultMemberPermissions: [
      PermissionFlagsBits.ManageRoles,
      PermissionFlagsBits.ManageChannels,
    ],
    dmPermission: false,
  },
  (interaction) => {
    langs.setLang(interaction.locale);
    if (!interaction.inCachedGuild()) return;
    const role = interaction.options.getRole('role', true);
    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageRoles,
      )
    )
      return interaction.reply({
        content: langs.tl(
          'field.notPermitted',
          'label.notEnoughBotPermission',
          'label.permission.manageRoles',
        ),
        ephemeral: true,
      });
    if (role.managed || role.id === interaction.guild.roles.everyone.id)
      return interaction.reply({
        content: langs.tl('label.verify.failed.unusableRole'),
        ephemeral: true,
      });
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
      interaction.member.roles.highest.position < role.position
    )
      return interaction.reply({
        content: langs.tl('label.verify.failed.higherRole'),
        ephemeral: true,
      });
    if (!role.editable)
      return interaction.reply({
        content: langs.tl('label.verify.failed.botHigherRole'),
        ephemeral: true,
      });

    const verifyType: VerifyType = interaction.options.getString(
      'type',
      true,
    ) as VerifyType;

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            langs.tl('field.verify', `commands.verify.type.${verifyType}`),
          )
          .setDescription(
            interaction.options.getString('description')?.replace('  ', '\n') ||
              null,
          )
          .setColor(interaction.options.getNumber('color') ?? Colors.Green)
          .setImage(interaction.options.getAttachment('image')?.url || null)
          .setFields({
            name: langs.tl('label.verify.giveRole'),
            value: role.toString(),
          }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setCustomId(`nonick-js:verify-${verifyType}`)
            .setLabel(langs.tl('label.verify'))
            .setStyle(ButtonStyle.Success),
        ),
      ],
    });
  },
);

const verifyButton = new Button(
  {
    customId: /^nonick-js:verify-(button|image)$/,
  },
  async (interaction) => {
    langs.setLang(interaction.locale);
    if (!interaction.inCachedGuild()) return;

    const roleId =
      interaction.message.embeds[0]?.fields[0]?.value?.match(
        /(?<=<@&)\d+(?=>)/,
      )?.[0];
    const roles = interaction.member.roles;

    if (duringAuthentication.has(interaction.user.id))
      return interaction.reply({
        content: langs.tl('label.verify.failed.inProgress'),
        ephemeral: true,
      });
    if (!roleId || !(roles instanceof GuildMemberRoleManager))
      return interaction.reply({
        content: langs.tl('label.verify.failed'),
        ephemeral: true,
      });
    if (roles.cache.has(roleId))
      return interaction.reply({
        content: langs.tl('label.verify.failed.alreadyDone'),
        ephemeral: true,
      });

    if (interaction.customId === 'nonick-js:verify-button') {
      roles
        .add(roleId, langs.tl('label.verify'))
        .then(() =>
          interaction.reply({
            content: langs.tl('label.verify.success'),
            ephemeral: true,
          }),
        )
        .catch(() =>
          interaction.reply({
            content: langs.tl('label.verify.failed.couldNotGrant'),
            ephemeral: true,
          }),
        );
    }

    if (interaction.customId === 'nonick-js:verify-image') {
      await interaction.deferReply({ ephemeral: true });

      const { image, text } = Captcha.create(
        { color: '#4b9d6e' },
        {},
        { amount: 5, blur: 25 },
        { rotate: 15, skew: true },
      );

      interaction.user
        .send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: langs.tl('field.verify', 'label.verify.image'),
                iconURL: interaction.guild.iconURL() ?? undefined,
              })
              .setDescription(langs.tl('label.verify.image.description'))
              .setColor(Colors.Blurple)
              .setImage('attachment://nonick-js-captcha.jpeg')
              .setFooter({
                text: langs.tl('label.verify.image.footer'),
              }),
          ],
          files: [
            new AttachmentBuilder(image, { name: 'nonick-js-captcha.jpeg' }),
          ],
        })
        .then(() => {
          duringAuthentication.add(interaction.user.id);
          interaction.followUp(langs.tl('label.verify.inductionDM'));

          if (!interaction.user.dmChannel) return;

          const collector = interaction.user.dmChannel.createMessageCollector({
            filter: (v) => v.author.id === interaction.user.id,
            time: Duration.toMS('1m'),
            max: 3,
          });

          collector.on('collect', (tryMessage) => {
            if (tryMessage.content !== text) return;

            roles
              .add(roleId, langs.tl('label.verify'))
              .then(() =>
                interaction.user.send(langs.tl('label.verify.success')),
              )
              .catch(() =>
                interaction.user.send(
                  langs.tl('label.verify.failed.grantRole'),
                ),
              )
              .finally(() => collector.stop());
          });

          collector.on('end', (collection) => {
            if (collection.size === 3) {
              interaction.user.send(
                langs.tl('label.verify.failed.tryCountsExceeded'),
              );
              setTimeout(
                () => duringAuthentication.delete(interaction.user.id),
                Duration.toMS('5m'),
              );
            } else duringAuthentication.delete(interaction.user.id);
          });
        })
        .catch(() => {
          interaction.followUp({
            content: langs.tl('label.verify.failed.sendDM'),
            ephemeral: true,
          });
        });
    }
  },
);

export default [verifyCommand, verifyButton];
