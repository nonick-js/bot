const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const discord_player = require('discord-player');

/**
* @callback InteractionCallback
* @param {discord.Client} client
* @param {discord.CommandInteraction} interaction
* @returns {void}
*/
/**
* @typedef ContextMenuData
* @prop {string} customid
* @prop {'BUTTON'|'SELECT_MENU'|'MODAL'} type
*/

module.exports = {
    /** @type {discord.ApplicationCommandData|ContextMenuData} */
    data: { name: 'music', description: '音楽を再生', descriptionLocalizations: { 'en-US': 'play music' }, type: 'CHAT_INPUT', options: [
        { name: 'play', description: 'Youtube・Spotify・SoundCloud上の音楽を再生します', descriptionLocalizations: { 'en-US': 'play music on Youtube, Spotify, and SoundCloud' }, type: 'SUB_COMMAND', options: [
            { name: 'url', description: '動画・音楽のURL (URL以外を入力すると動画を検索します)', descriptionLocalizations: { 'en-US': 'URL of video/music (Enter anything other than URL to search for videos)' }, type:'STRING', required: true },
        ] },
        { name: 'stop', description: 'プレイヤーを停止します', descriptionLocalizations: { 'en-US': 'stops the player' }, type: 'SUB_COMMAND' },
        { name: 'panel', description: '現在の再生パネルを表示します', descriptionLocalizations: { 'en-US' : 'displays the current playback panel' }, type: 'SUB_COMMAND' },
        { name: 'queue', description: '現在のキューを表示します', descriptionLocalizations: { 'en-US': 'displays the current queue' }, type: 'SUB_COMMAND' },
        { name: 'queuedelete', description: '指定した位置にあるトラックをキューから削除します', descriptionLocalizations: { 'en-US': '指定した位置にあるトラックをキューから削除します' }, type: 'SUB_COMMAND', options: [
            { name: 'track', description: '削除するトラックの位置', descriptionLocalizations: { 'en-US': 'location of track to be deleted' }, type: 'NUMBER', required: true },
        ] },
        { name: 'skip', description: '今流している曲をスキップして次のキューを再生します', descriptionLocalizations: { 'en-US': 'Skips the currently playing song and plays the next cue' }, type: 'SUB_COMMAND' },
        { name: 'previous', description: '前に再生されたトラックを再生します', descriptionLocalizations: { 'en-US': 'plays the previously played track' }, type: 'SUB_COMMAND' },
        { name: 'loop', description: 'キューのループ設定を変更します', descriptionLocalizations: { 'en-US': 'change queue loop settings' }, type: 'SUB_COMMAND', options: [
            { name: 'set', description: 'ループ設定', descriptionLocalizations: { 'en-US': 'loop setting' }, type: 'NUMBER', required: true, choices: [
                { name: '🎵 通常再生', descriptionLocalizations: { 'en-US': 'usually regenerated' }, value: 0 },
                { name: '🔂 1曲ループ再生', descriptionLocalizations: { 'en-US': 'loop playback of one song' }, value: 1 },
                { name: '🔁 キューループ再生', descriptionLocalizations: { 'en-US': 'Cue Loop Playback' }, value: 2 },
            ] },
        ] },
        { name: 'volume', description: '音量設定', descriptionLocalizations: { 'en-US': 'volume setting' }, type: 'SUB_COMMAND', options: [
            { name: 'amount', description: '音量 (1~200)', descriptionLocalizations: { 'en-US': 'volue (1~200)' }, type: 'NUMBER', required: true },
        ] },
    ] },
    /** @type {InteractionCallback} */
    exec: async (client, interaction, Configs, language, player) => {
        /** @type {discord_player.Queue} */
        const queue = player.getQueue(interaction.guildId);
        const config = await Configs.findOne({ where: { serverId: interaction.guild.id } });
        const { dj, djRole } = config.get();

        if (dj && !interaction.member.roles.cache.has(djRole) && !interaction.member.permissions.has('ADMINISTRATOR') && !interaction.options.getSubcommand() == 'queue') {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_DJROLE', djRole))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (!interaction.member.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_VC_NOTJOIN'))
                .setColor('RED');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            const embed = new discord.MessageEmbed()
                .setDescription(language('MUSIC_PLAYINGVC_NOTJOIN'))
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
                return await interaction.reply({ content: `${language('MUSIC_PLAY_ERROR')}`, ephemeral: true });
            }

            await interaction.deferReply();
            const track = await player.search(query, { requestedBy: interaction.user }).then(x => x.tracks[0]);
            if (!track) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_PLAY_URLERROR', query))
                    .setColor('RED');
                return await interaction.followUp({ embeds: [embed], ephemeral: true });
            }
            newqueue.play(track);
            const embed = new discord.MessageEmbed()
                .setTitle(language('MUSIC_ADDQUEUE'))
                .setDescription(`💿${track.title}\n🔗${track.url}`)
                .setColor('GREEN');
            return await interaction.followUp({ embeds: [embed] });
        }

        if (interaction.options.getSubcommand() == 'stop') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            queue.destroy(true);
            interaction.reply({ content: `${language('MUSIC_STOP_SUCCESS')}` });
        }

        if (interaction.options.getSubcommand() == 'panel') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
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
            interaction.reply({ content: `▶ ${language('TRACKSTART_PLAYING')} 🔗${track.url}`, components: [button], ephemeral: true });
        }

        if (interaction.options.getSubcommand() == 'queue') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const track = queue.tracks;
            let queueString = '';
            const nowPlaying = `💿 **${queue.current.title}**\n🔗 ${queue.current.url}\n${queue.createProgressBar()}`;
            for (let i = 0; i < track.length; i++) {
                queueString = queueString + `**${i + 1}.** ${track[i].title}\n`;
            }
            if (queueString == null) queueString = language('MUSIC_QUEUE_NULL');
            const embed = new discord.MessageEmbed()
                .setThumbnail(queue.current.thumbnail)
                .setColor('WHITE')
                .addFields(
                    { name: `${language('TRACKSTART_PLAYING')}`, value: nowPlaying },
                )
                .setFooter({ text: queue.repeatMode == 0 ? language('MUSIC_QUEUE_PLAYMODE_1') : queue.repeatMode == 1 ? language('MUSIC_QUEUE_PLAYMODE_2') : language('MUSIC_QUEUE_PLAYMODE_3') });
            if (queueString !== '') embed.addFields({ name:`${language('MUSIC_QUEUE_EMBED_FIELD_1')}`, value: queueString });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.options.getSubcommand() == 'queuedelete') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const number = interaction.options.getNumber('track');
            if (number < 1) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_QUEUEDELETE_ERROR'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            try {
                /** @type {discord_player.Track} */
                queue.remove(number - 1);
                // eslint-disable-next-line no-empty-function
                interaction.reply(language('MUSIC_QUEUEDELETE_SUCCESS'));
            }
            catch {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_QUEUEDELETE_ERROR'))
                    .setColor('RED');
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }

        if (interaction.options.getSubcommand() == 'skip') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            interaction.reply(language('MUSIC_SKIP_SUCCESS', queue.current.title));
            queue.skip();
        }

        if (interaction.options.getSubcommand() == 'loop') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const type = interaction.options.getNumber('set');
            queue.setRepeatMode(type);
            interaction.reply(type == 0 ? language('MUSIC_LOOP_PLAYMODE_1') : (type == 1 ? language('MUSIC_LOOP_PLAYMODE_2') : language('MUSIC_LOOP_PLAYMODE_3')));
        }

        if (interaction.options.getSubcommand() == 'volume') {
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_NULLQUEUE'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const amount = interaction.options.getNumber('amount');
            // eslint-disable-next-line use-isnan
            if (amount < 1 || amount > 200) {
                const embed = new discord.MessageEmbed()
                    .setDescription(language('MUSIC_VOLUME_ERROR'))
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            queue.setVolume(amount);
            interaction.reply(language('MUSIC_VOLUME_SUCCESS'));
        }
    },
};