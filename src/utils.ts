import { Migration } from "typeorm";

export function getDatabaseConnectionString(logger: (message: string) => void) {
  if (!process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL) {
    logger("SLS_TYPEORM_MIGRATIONS_DATABASE_URL environment variable required");
    process.exit(1);
  }

  return process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL;
}

export function getEngine(logger: (message: string) => void): any {
  if (!process.env.SLS_TYPEORM_MIGRATIONS_ENGINE) {
    logger("SLS_TYPEORM_MIGRATIONS_ENGINE environment variable required");
    process.exit(1);
  }
  return process.env.SLS_TYPEORM_MIGRATIONS_ENGINE;
}

export function getMigrationFolder(logger: (message: string) => void) {
  if (!process.env.SLS_TYPEORM_MIGRATIONS_FOLDER) {
    logger("SLS_TYPEORM_MIGRATIONS_FOLDER environment variable required");
    process.exit(1);
  }

  return process.env.SLS_TYPEORM_MIGRATIONS_FOLDER;
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
