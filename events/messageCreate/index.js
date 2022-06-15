const discord = require('discord.js');
const pagination = require('../../modules/pagination');

module.exports = {
    async execute(client, message) {
        const results = [...message.content.matchAll(/https:\/\/(?:.+\.)?discord(?:.+)?.com\/channels\/(?<guildId>\d+)\/(?<channelId>\d+)\/(?<messageId>\d+)/g)];
        results.forEach(async v => {
            try {
                const channel = await client.channels.fetch(v.groups.channelId, { force: true });
                if (!channel || !channel.isText()) throw new TypeError('Unknown Channel');
                const msg = await channel.messages.fetch(v.groups.messageId, { force: true });
                if (!msg) throw new TypeError('Unknown Message');
                const contentEmbeds = msg.content ? discord.Util.splitMessage(msg.content, { maxLength: 1024, char: '' }).map(content => {
                    return new discord.MessageEmbed()
                        .setTitle('メッセージ展開')
                        .setColor('WHITE')
                        .setURL(v[0])
                        .setAuthor({
                            name: msg.member?.displayName ?? msg.author.username,
                            iconURL: msg.member?.displayAvatarURL({ dynamic: true }) ?? msg.author.displayAvatarURL({ dynamic: true }),
                        })
                        .addField('メッセージの内容', content);
                }) : [];
                const attachmentEmbeds = msg.attachments.map(attachment => {
                    return new discord.MessageEmbed()
                        .setTitle('メッセージ展開')
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
                    .setTitle('エラー!')
                    .setColor('RED')
                    .setDescription(err.message);
                message.reply({ embeds: [em], allowedMentions: { parse: [] } });
            }
        });
    },
};