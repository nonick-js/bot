const discord = require('discord.js');

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
            { name: 'url', description: '動画・音楽のURL', type:'STRING', required: true },
        ] },
        { name: 'queue', description: '現在のキューを表示します', type: 'SUB_COMMAND' },
        { name: 'skip', description: '今流している曲をスキップして次のキューを再生します', type: 'SUB_COMMAND' },
        { name: 'stop', description: 'プレイヤーを停止します', type: 'SUB_COMMAND' },
        { name: 'volume', description: '音量を設定します', type: 'SUB_COMMAND', options: [
            { name: 'amount', description: '音量 (1~200)', type: 'NUMBER', required: true },
        ] },
    ] },
    /** @type {InteractionCallback} */
    exec: async (interaction, client, Configs, player) => {
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
            const queue = player.createQueue(interaction.guild, {
                ytdlOptions: {
                quality: 'highest',
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
                },
                metadata: {
                channel: interaction.channel,
                },
                });

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                queue.destroy();
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
            queue.play(track);
            const embed = new discord.MessageEmbed()
                .setTitle('キューに追加されました!')
                .setDescription(`💿${track.title}\n🔗${track.url}`)
                .setColor('GREEN');
            return await interaction.followUp({ embeds: [embed] });
        }

        if (interaction.options.getSubcommand() == 'queue') {
            /** @type {discord_player.Queue} */
            const queue = player.getQueue(interaction.guildId);
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

        if (interaction.options.getSubcommand() == 'skip') {
            const queue = player.getQueue(interaction.guildId);
            if (!queue) {
                const embed = new discord.MessageEmbed()
                    .setDescription('キューがありません!')
                    .setColor('RED');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            interaction.reply(`⏯ **${queue.current.title}** をスキップしました。`);
            queue.skip();
        }

        if (interaction.options.getSubcommand() == 'stop') {
            player.deleteQueue(interaction.guild);
            interaction.reply({ content: '⏹ プレイヤーを停止しました' });
        }

        if (interaction.options.getSubcommand() == 'volume') {
            const queue = player.getQueue(interaction.guildId);
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