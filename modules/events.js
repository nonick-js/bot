const fs = require('fs');
const path = require('path');

/**
 * @param {String} eventsPath
 * @param {import('discord.js').Client} client
 * @returns {void}
 */
const eventsHandler = (eventsPath, client) => {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const events = require(filePath);

    for (const event of events) {
      if (event?.once) {
        client.once(event.name, (...args) => event.execute(...args));
      }
      else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }
  }
};

module.exports = eventsHandler;