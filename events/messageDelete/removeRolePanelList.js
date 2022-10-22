// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');
const FeatureData = require('../../schemas/featureDataSchema');

module.exports = {
  /** @param {discord.Message} message */
  async execute(message) {
    if (message.partial && !message.components?.[0]) return;

    const res = await FeatureData.findOneAndUpdate(
      { serverId: message.guildId },
      { $pull: { 'reactionRole.button.messages': [{ channelId: message.channelId, messageId: message.id }] } },
      { new: true },
    );
    res.save({ wtimeout: 1500 });
  },
};