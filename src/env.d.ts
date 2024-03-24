declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        BOT_TOKEN: string;
        GUILD_ID?: string;
        LOG_CHANNEL_ID: string;
        MONGODB_URI: string;
        MONGODB_DBNAME: string;
      }
    }
  }
}