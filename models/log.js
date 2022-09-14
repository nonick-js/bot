const { Model, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    class log extends Model {}

    return log.init({
        serverId: { type: DataTypes.STRING },
        log: { type: DataTypes.BOOLEAN, defaultValue: false },
        logCh: { type: DataTypes.STRING, defaultValue: null },
        bot: { type: DataTypes.BOOLEAN, defaultValue: false },
        timeout: { type: DataTypes.BOOLEAN, defaultValue: false },
        kick: { type: DataTypes.BOOLEAN, defaultValue: false },
        ban: { type: DataTypes.BOOLEAN, defaultValue: false },
    }, {
      sequelize,
      modelName: 'log',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
};