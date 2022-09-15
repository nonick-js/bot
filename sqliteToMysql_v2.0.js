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
    dialect: 'mysql',
    logging: false,
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
    SQLiteModel.forEach(async (v) => {
        await require(`./models/${param}`)(MySQL).findOrCreate({ where: { serverId: v.serverId } });
        const MySQLModel = await require(`./models/${param}`)(MySQL).findOne({ where: { serverId: v.serverId } });

        switch (param) {
            case 'basic':
                MySQLModel.update({
                    reportCh: v.reportCh,
                    reportRoleMention: v.reportRoleMention,
                    reportRole: v.reportRole,
                    messageExpansion: v.messageExpansion,
                });
                break;
            case 'welcomeM':
                MySQLModel.update({
                    welcome: v.welcome,
                    welcomeCh: v.welcomeCh,
                    welcomeMessage: v.welcomeMessage,
                    leave: v.leave,
                    leaveCh: v.leaveCh,
                    leaveMessage: v.leaveMessage,
                });
                break;
            case 'log':
                MySQLModel.update({
                    log: v.log,
                    logCh: v.logCh,
                    bot: v.bot,
                    timeout: v.timeout,
                    kick: v.kick,
                    ban: v.ban,
                });
                break;
            case 'verification':
                MySQLModel.update({
                    verification: v.verification,
                    oldLevel: v.oldLevel,
                    newLevel: v.newLevel,
                    startChangeTime: v.startChangeTime,
                    endChangeTime: v.endChangeTime,
                });
                break;
        }
    });
}