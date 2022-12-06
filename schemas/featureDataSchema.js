const mongoose = require('mongoose');

const featureDataSchema = new mongoose.Schema({
  serverId: { type: mongoose.SchemaTypes.String, required: true, unique: true },

  reactionRole: {
    button: {
      messages: [{ channelId: mongoose.SchemaTypes.String, messageId: mongoose.SchemaTypes.String }],
      max: { type: mongoose.SchemaTypes.Number, default: null },
    },
  },
});

module.exports = mongoose.model('FeatureData', featureDataSchema);