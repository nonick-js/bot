const { Model, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    class verification extends Model {}

    return verification.init({
        serverId: { type: DataTypes.STRING, unique: true },

        verification: { type: DataTypes.BOOLEAN, defaultValue: false },
        oldLevel: { type: DataTypes.NUMBER, defaultValue: null },
        newLevel: { type: DataTypes.NUMBER, defaultValue: null },
        startChangeTime: { type: DataTypes.NUMBER, defaultValue: null },
        endChangeTime: { type: DataTypes.NUMBER, defaultValue: null },
    }, {
      sequelize,
      modelName: 'verification',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
};