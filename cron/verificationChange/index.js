module.exports = {
	/**
	 * @param {import('discord.js').Client} client
	 * @param {Date} date
	 */
	async execute(client, date) {
		const hour = date.getHours() - 9 < 0 ? date.getHours() + 24 - 9 : date.getHours() - 9;

		require('./startVerificationChange').execute(client, hour);
		require('./endVerificationChange').execute(client, hour);
	},
};