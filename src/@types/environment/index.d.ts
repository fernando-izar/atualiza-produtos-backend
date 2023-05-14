declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PORT: number | undefined;
    }
  }
}

export {};
