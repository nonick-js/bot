const { Model, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    class verification extends Model {}

    return verification.init({
        serverId: { type: DataTypes.STRING },
        verification: { type: DataTypes.BOOLEAN, defaultValue: 0 },
        oldLevel: { type: DataTypes.INTEGER, defaultValue: null },
        newLevel: { type: DataTypes.INTEGER, defaultValue: null },
        startChangeTime: { type: DataTypes.INTEGER, defaultValue: null },
        endChangeTime: { type: DataTypes.INTEGER, defaultValue: null },
    }, {
      sequelize,
      modelName: 'verification',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
};