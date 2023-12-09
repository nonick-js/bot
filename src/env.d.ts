declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly DISCORD_TOKEN: string;
        readonly DB_URI: string;
        readonly DB_NAME: string;
      }
    }
  }
}
