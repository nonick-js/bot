// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

/**
 * @callback verificationChangeCallback
 * @param {import('discord.js').Client} client
 * @param {Date} date
 */

module.exports = {
    /** @type {verificationChangeCallback} */
    async execute(client, date) {
        const hour = date.getHours() - 9 < 0 ? date.getHours() + 24 - 9 : date.getHours() - 9;

        require('./startVerificationChange').execute(client, hour);
        require('./endVerificationChange').execute(client, hour);
    },
};