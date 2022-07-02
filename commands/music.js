const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_player = require('discord-player');

/**
* @callback InteractionCallback
* @param {discord.CommandInteraction} interaction
* @param {...any} [args]
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'music', description: '音楽を再生', type: 'CHAT_INPUT', options: [
        { name: 'play', description: 'Youtube・Spotify・SoundCloud上の音楽を再生します', type: 'SUB_COMMAND', options: [
            { name: 'url', description: '動画・音楽のURL (URL以外を入力すると動画を検索します)', type:'STRING', required: true },
        ] },
        { name: 'stop', description: 'プレイヤーを停止します', type: 'SUB_COMMAND' },
        { name: 'panel', description: '現在の再生パネルを表示します', type: 'SUB_COMMAND' },
        { name: 'queue', description: '現在のキューを表示します', type: 'SUB_COMMAND' },
        { name: 'queuedelete', description: '指定した位置にあるトラックをキューから削除します', type: 'SUB_COMMAND', options: [
            { name: 'track', description: '削除するトラックの位置', type: 'NUMBER', required: true },
        ] },
        { name: 'skip', description: '今流している曲をスキップして次のキューを再生します', type: 'SUB_COMMAND' },
        { name: 'previous', description: '前に再生されたトラックを再生します', type: 'SUB_COMMAND' },
        { name: 'loop', description: 'キューのループ設定を変更します', type: 'SUB_COMMAND', options: [
            { name: 'set', description: 'ループ設定', type: 'NUMBER', required: true, choices: [
                { name: '🎵 通常再生', value: 0 },
                { name: '🔂 1曲ループ再生', value: 1 },
                { name: '🔁 キューループ再生', value: 2 },
            ] },
        ] },
        { name: 'volume', description: '音量を設定します', type: 'SUB_COMMAND', options: [
            { name: 'amount', description: '音量 (1~200)', type: 'NUMBER', required: true },
        ] },
    ] },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs, player) => {
        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { dj, djRole } = config.get();

        if (dj && !interaction.member.roles.cache.has(djRole) && !interaction.member.permissions.has('ADMINISTRATOR') && !interaction.options.getSubcommand() == 'queue') {
            const embed = new discord.MessageEmbed()
                .setDescription(`❌ この機能は${discord.Formatters.roleMention(djRole)}を持つメンバーのみが使用できます!`)
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!interaction.member.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ ボイスチャンネルに参加してください!')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription('❌ 現在再生中のボイスチャンネルに参加してください!')
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.options.getSubcommand() == 'play') {
            const query = interaction.options.get('url').value;
            const newqueue = player.createQueue(interaction.guild, {
                ytdlOptions: { quality: 'highest', filter: 'audioonly', highWaterMark: 1 << 25, dlChunkSize: 0 },
                metadata: { channel: interaction.channel },
            });

            try {
                if (!newqueue.connection) await newqueue.connect(interaction.member.voice.channel);
            } catch {
                newqueue.destroy();
                return await interaction.reply({ content: '❌ ボイスチャンネルにアクセスできません!', ephemeral: true });
            }

            await interaction.deferReply();
            const track = await player.search(query, { requestedBy: interaction.user }).then(x => x.tracks[0]);
            if (!track) {
                const embed = new discord.MessageEmbed()
                    .setDescription(`❌ ${query} が見つかりません!\n正しいURLを入力してください。`)
                    .setColor('RED');
                return await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
            newqueue.play(track);
            const embed = new discord.MessageEmbed()
                .setTitle('キューに追加されました!')
                .setDescription(`💿${track.title}\n🔗${track.url}`)
                .setColor('GREEN');
            return await interaction.followUp({ embeds: [embed] });
        }

        if (interaction.options.getSubcommand() == 'stop') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('キューがありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            queue.destroy(true);
            interaction.reply({ content: '⏹ プレイヤーを停止しました' });
        }

        if (interaction.options.getSubcommand() == 'panel') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('キューがありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const track = queue.current;
            const button = new discord.MessageActionRow().addComponents(
                new discord.MessageButton()
                    .setCustomId('music-prev')
                    .setEmoji('⏮️')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('music-pause')
                    .setEmoji('⏯️')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('music-skip')
                    .setEmoji('⏭️')
                    .setStyle('PRIMARY'),
                new discord.MessageButton()
                    .setCustomId('music-volume')
                    .setEmoji('🔊')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('music-panel')
                    .setEmoji('966596708458983484')
                    .setStyle('SUCCESS'),
            );
            interaction.reply({ content: `▶ 再生中 🔗${track.url}`, components: [button], ephemeral: true });
        }

        if (interaction.options.getSubcommand() == 'queue') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('現在キューはありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const track = queue.tracks;
            let queueString = '';
            const nowPlaying = `💿 **${queue.current.title}**\n🔗 ${queue.current.url}\n${queue.createProgressBar()}`;
            for (let i = 0; i < track.length; i++) {
                queueString = queueString + `**${i + 1}.** ${track[i].title}\n`;
            }
            if (queueString == null) queueString = 'なし';
            const embed = new discord.MessageEmbed()
                .setThumbnail(queue.current.thumbnail)
                .setColor('WHITE')
                .addFields(
                    { name: '再生中', value: nowPlaying },
                )
                .setFooter({ text: queue.repeatMode == 0 ? '▶️ 通常再生' : queue.repeatMode == 1 ? '🔂 1曲ループ再生' : '🔁 キューループ再生' });
            if (queueString !== '') embed.addFields({ name: 'キュー', value: queueString });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.options.getSubcommand() == 'queuedelete') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('キューがありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const number = interaction.options.getNumber('track');
            if (number < 1) {
                const embed = new discord.MessageEmbed()
                    .setDescription('❌ 無効な値が送信されました!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            try {
                /** @type {discord_player.Track} */
                queue.remove(number - 1);
                // eslint-disable-next-line no-empty-function
                interaction.reply(`🗑️ ${number}つ先の音楽をキューから削除しました`);
            }
            catch {
                const embed = new discord.MessageEmbed()
                    .setDescription('❌ 無効な値が送信されました!')
                    .setColor('RED');
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        if (interaction.options.getSubcommand() == 'skip') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('キューがありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            interaction.reply(`⏯ **${queue.current.title}** をスキップしました。`);
            queue.skip();
        }

        if (interaction.options.getSubcommand() == 'loop') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('❌ 現在キューはありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const type = interaction.options.getNumber('set');
            queue.setRepeatMode(type);
            interaction.reply(type == 0 ? '▶️ キューのループ再生を**オフ**にしました' : (type == 1 ? '🔂 1曲ループ再生を**オン**にしました' : '🔁 キューループ再生を**オン**にしました'));
        }

        if (interaction.options.getSubcommand() == 'volume') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('キューがありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const amount = interaction.options.getNumber('amount');
            // eslint-disable-next-line use-isnan
            if (amount < 1 || amount > 200) {
                const embed = new discord.MessageEmbed()
                    .setDescription(`❌ 音量は${discord.Formatters.inlineCode('1')}から${discord.Formatters.inlineCode('200')}までの間で指定してください!`)
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            queue.setVolume(amount);
            interaction.reply(`🔊 音量を${discord.Formatters.inlineCode(amount)}に変更しました`);
        }
    },
};