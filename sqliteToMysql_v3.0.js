const Sequelize = require('sequelize');
require('dotenv').config();

const SQLite = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'models/.config.sqlite',
});
console.info('SQLiteの接続に成功しました。');

const MySQL = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    dialect: 'mysql',
    dialectOptions: {
        ssl:'Amazon RDS',
    },
});
console.info('MySQLへの接続に成功しました。');

syncDB(SQLite);
syncDB(MySQL);

start();

async function start() {
    await sqliteToMysql('basic');
    console.log('- basicモデルの移行が完了しました。');

    await sqliteToMysql('log');
    console.log('- logモデルの移行が完了しました。');

    await sqliteToMysql('welcomeM');
    console.log('- welcomeMモデルの移行が完了しました。');

    await sqliteToMysql('verification');
    console.log('- verificationモデルの移行が完了しました。');
    process.exit();
}

async function syncDB(param) {
    await require('./models/basic')(param).sync({ alter: true });
    await require('./models/welcomeM')(param).sync({ alter: true });
    await require('./models/log')(param).sync({ alter: true });
    await require('./models/verification')(param).sync({ alter: true });
}

async function sqliteToMysql(param) {
    const SQLiteModel = await require(`./models/${param}`)(SQLite).findAll();
    SQLiteModel.forEach(async (model) => {
        await require(`./models/${param}`)(MySQL).findOrCreate({ where: { serverId: model.serverId } });
        const MySQLModel = await require(`./models/${param}`)(MySQL).findOne({ where: { serverId: model.serverId } });

        switch (param) {
            case 'basic':
                MySQLModel.update({
                    reportCh: model.reportCh,
                    reportRoleMention: model.reportRoleMention,
                    reportRole: model.reportRole,
                    messageExpansion: model.messageExpansion,
                });
                break;
            case 'welcomeM':
                MySQLModel.update({
                    welcome: model.welcome,
                    welcomeCh: model.welcomeCh,
                    welcomeMessage: model.welcomeMessage,
                    leave: model.leave,
                    leaveCh: model.leaveCh,
                    leaveMessage: model.leaveMessage,
                });
                break;
            case 'log':
                MySQLModel.update({
                    log: model.log,
                    logCh: model.logCh,
                    bot: model.bot,
                    timeout: model.timeout,
                    kick: model.kick,
                    ban: model.ban,
                });
                break;
            case 'verification':
                MySQLModel.update({
                    verification: model.verification,
                    oldLevel: model.oldLevel,
                    newLevel: model.newLevel,
                    startChangeTime: model.startChangeTime,
                    endChangeTime: model.endChangeTime,
                });
                break;
        }
    });
}