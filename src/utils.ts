import { ConnectionOptions, Migration } from "typeorm";

export function getConnectionOptions(logger: (message: string) => void): ConnectionOptions {
  if (!process.env.SLS_TYPEORM_MIGRATIONS_ENGINE) {
    logger("SLS_TYPEORM_MIGRATIONS_ENGINE environment variable required");
    process.exit(1);
  }
  if (!process.env.SLS_TYPEORM_MIGRATIONS_FOLDER) {
    logger("SLS_TYPEORM_MIGRATIONS_FOLDER environment variable required");
    process.exit(1);
  }
  if (
    !process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL && 
    (
      !process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_USERNAME || 
      !process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_PASSWORD || 
      !process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_NAME || 
      !process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_HOST || 
      !process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_PORT
    )
  ) {
    logger("SLS_TYPEORM_MIGRATIONS_DATABASE_URL or [SLS_TYPEORM_MIGRATIONS_DATABASE_USERNAME, SLS_TYPEORM_MIGRATIONS_DATABASE_PASSWORD, SLS_TYPEORM_MIGRATIONS_DATABASE_NAME, SLS_TYPEORM_MIGRATIONS_DATABASE_HOST, SLS_TYPEORM_MIGRATIONS_DATABASE_PORT] environment variable required");
    process.exit(1);
  }
  let dbOptions: {
    url?: string,
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
  } = {};
  if (process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL) {
    dbOptions.url = process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL!!;
  } else {
    dbOptions.host = process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_HOST!!;
    dbOptions.port = parseInt(process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_PORT!!);
    dbOptions.database = process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_NAME!!;
    dbOptions.username = process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_USERNAME!!;
    dbOptions.password = Buffer.from(process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_PASSWORD!!, 'base64').toString('ascii');
  }
  return {
    type: process.env.SLS_TYPEORM_MIGRATIONS_ENGINE as any,
    url: process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL,
    migrations: [process.env.SLS_TYPEORM_MIGRATIONS_FOLDER],
    ...dbOptions,
  };
}

export function logMigrations(
  logger: (message: string) => void,
  migrations: Migration[] | undefined
) {
  if (typeof migrations !== "undefined" && migrations?.length > 0) {
    migrations?.forEach((migration) => logger(`Migrated: ${migration.name}`));
  } else {
    logger("No new migrations to run");
  }
}
