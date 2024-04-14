declare module 'node:process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly DISCORD_TOKEN: string;
        readonly GUILD_ID?: string;
        readonly LOG_CHANNEL_ID: string;
        readonly DB_URI: string;
        readonly DB_NAME: string;
      }
    }
  }
}
