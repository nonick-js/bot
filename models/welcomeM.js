const { Model, DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    class welcomeM extends Model {}

    return welcomeM.init({
        serverId: { type: DataTypes.STRING, unique: true },
        welcome: { type: DataTypes.BOOLEAN, defaultValue: false },
        welcomeCh: { type: DataTypes.STRING, defaultValue: null },
        welcomeMessage: { type: DataTypes.TEXT, defaultValue: [
          '![user] **(![userTag])** さん',
          '**![serverName]**へようこそ！',
          'まずはルールを確認しよう！\n',
          '現在のメンバー数: **![memberCount]**人',
        ].join('\n') },
        leave: { type: DataTypes.BOOLEAN, defaultValue: false },
        leaveCh: { type: DataTypes.STRING, defaultValue: null },
        leaveMessage: { type: DataTypes.TEXT, defaultValue: '**![userTag]** さんがサーバーを退室しました👋' },
    }, {
      sequelize,
      modelName: 'welcomeM',
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    });
};