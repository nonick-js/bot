const discord = require('discord.js');
const Configs = require('../../schemas/configSchema');

const verificationStatusData = [
	{ name: '設定しない', description: '無制限' },
	{ name: '低', description: 'メール認証がされているアカウントのみ' },
	{ name: '中', description: 'Discordに登録してから5分以上経過したアカウントのみ' },
	{ name: '高', description: 'このサーバーのメンバーとなってから10分以上経過したメンバーのみ' },
	{ name: '最高', description: '電話認証がされているアカウントのみ' },
];

module.exports = {
	/**
	 * @param {discord.Client} client
	 * @param {number} hour
	 */
	async execute(client, hour) {
		const taskLists = await Configs.find({ verification: { enable: true, startChangeTime: hour } });
		if (!taskLists) return;

		taskLists.forEach(async (Config) => {
			const guild = await client.guilds.fetch(Config.serverId).catch(() => {});
			if (!guild) return;

			guild.setVerificationLevel(Config.verification.oldLevel)
				.then(async () => {
					if (!Config.log.enable || !Config.log.category.bot) return;

					const channel = await guild.channels.fetch(Config.log.channel).catch(() => {});
					if (!channel) {
						Config.log.enable = false;
						Config.log.channel = null;
						return Config.save({ wtimeout: 1500 });
					}

					const embed = new discord.EmbedBuilder()
						.setTitle('認証レベル自動変更 - 終了')
						.setDescription([
								`サーバーの認証レベルを**${verificationStatusData[Config.verification.oldLevel].name}**に戻しました。`,
								`\`${verificationStatusData[Config.verification.oldLevel].description}\``,
								'[レベルがうまく戻らない場合](https://docs.nonick-js.com/features/verification/#上手く動かない時は)',
						].join('\n'))
						.setColor('Green');

					channel.send({ embeds: [embed] }).catch(() => {});
					Config.save({ wtimeout: 1500 });
				})
				.catch(async () => {
					Config.verification.enable = false;
					Config.save({ wtimeout: 1500 });
				});
		});
	},
};