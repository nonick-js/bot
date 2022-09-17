const { Model, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    class basic extends Model {}

    return basic.init({
        serverId: { type: DataTypes.STRING, allowNull: false },
        reportCh: { type: DataTypes.STRING, defaultValue: null },
        reportRoleMention: { type: DataTypes.BOOLEAN, defaultValue: false },
        reportRole: { type: DataTypes.STRING, defaultValue: null },
        messageExpansion: { type: DataTypes.BOOLEAN, defaultValue: false },
    }, {
      sequelize,
      modelName: 'basic',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
};