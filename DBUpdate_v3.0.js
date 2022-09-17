const Sequelize = require('sequelize');

const SQLite_v2 = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'config.sqlite',
});

const Configs_v2 = SQLite_v2.define('configs', {
    serverId: { type: Sequelize.STRING, unique: true },
    welcome: { type: Sequelize.BOOLEAN, defaultValue: false },
    welcomeCh: { type: Sequelize.STRING, defaultValue: null },
    leave: { type: Sequelize.BOOLEAN, defaultValue: false },
    leaveCh: { type: Sequelize.STRING, defaultValue: null },
    reportCh: { type: Sequelize.STRING, defaultValue: null },
    reportRoleMention: { type: Sequelize.BOOLEAN, defaultValue: false },
    reportRole: { type: Sequelize.STRING, defaultValue: null },
    linkOpen: { type: Sequelize.BOOLEAN, defaultValue: false },
}, { timestamps: false, createdAt: false, updatedAt: false });

const syncDB_v2 = async () => {
    Configs_v2.sync({ alter: true });
};

syncDB_v2();
