const discord = require('discord.js');
const pagination = require('../../modules/pagination');
/**
 * @callback messageCreateCallback
 * @param {discord.Client} client
 * @param {discord.Message} message
 */

module.exports = {
    /** @type {messageCreateCallback} */
    async execute(client, message, Configs, language) {
        if (message.author.bot) return;
        const config = await Configs.findOne({ where: { serverId: message.guild.id } });
        const linkOpen = config.get('linkOpen');

        if (linkOpen) {
            const results = [...message.content.matchAll(/https:\/\/(?:.+\.)?discord(?:.+)?.com\/channels\/(?<guildId>\d+)\/(?<channelId>\d+)\/(?<messageId>\d+)/g)];
            results.forEach(async v => {
                try {
                    const channel = await client.channels.fetch(v.groups.channelId, { force: true });
                    if (!channel || !channel.isText()) throw new TypeError('Unknown Channel');
                    const msg = await channel.messages.fetch(v.groups.messageId, { force: true });
                    if (!msg) throw new TypeError('Unknown Message');
                    const contentEmbeds = msg.content ? discord.Util.splitMessage(msg.content, { maxLength: 1024, char: '' }).map(content => {
                        return new discord.MessageEmbed()
                            .setTitle(language('MESSAGECREATE_MESSAGELINKEXPANSION_CONTENTEMBED_TITLE'))
                            .setColor('WHITE')
                            .setURL(v[0])
                            .setAuthor({
                                name: msg.member?.displayName ?? msg.author.username,
                                iconURL: msg.member?.displayAvatarURL({ dynamic: true }) ?? msg.author.displayAvatarURL({ dynamic: true }),
                            })
                            .addField(language('MESSAGECREATE_MESSAGELINKEXPANSION_CONTENTEMBED_FIELD'), content);
                    }) : [];
                    const attachmentEmbeds = msg.attachments.map(attachment => {
                        return new discord.MessageEmbed()
                            .setTitle(language('MESSAGECREATE_MESSAGELINKEXPANSION_CONTENTEMBED_TITLE'))
                            .setColor('WHITE')
                            .setURL(v[0])
                            .setAuthor({
                                name: msg.member?.displayName ?? msg.author.username,
                                iconURL: msg.member?.displayAvatarURL({ dynamic: true }) ?? msg.author.displayAvatarURL({ dynamic: true }),
                            })
                            .setImage(attachment.url);
                    });
                    pagination.message(message, [...contentEmbeds, ...attachmentEmbeds, ...msg.embeds], { parse: [] });
                }
                catch (err) {
                    console.log(err);
                    const em = new discord.MessageEmbed()
                        .setTitle(language('MESSAGECREATE_MESSAGELINKEXPANSION_ERROR_TITLE'))
                        .setColor('RED')
                        .setDescription(err.message);
                    message.reply({ embeds: [em], allowedMentions: { parse: [] } });
                }
            });
        }
    },
};