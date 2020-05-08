import Migration from "./migration";
import { Context, Callback } from "aws-lambda";

const success = (response: any) => ({
  statusCode: 200,
  body: JSON.stringify(response),
});

const getEngine = (): any => {
  if (!process.env.SLS_TYPEORM_MIGRATIONS_ENGINE) {
    process.exit(1);
  }
  return process.env.SLS_TYPEORM_MIGRATIONS_ENGINE;
};

const getMigrationFolder = () => {
  if (!process.env.SLS_TYPEORM_MIGRATIONS_FOLDER) {
    process.exit(1);
  }

  return process.env.SLS_TYPEORM_MIGRATIONS_FOLDER;
};

const handler = (handlerName: string) => async (
  event: any,
  context: Context,
  callback: Callback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const migration: Migration = new Migration({
    type: getEngine(),
    url: process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL,
    migrations: [getMigrationFolder()],
  });

  try {
    const response = await migration[handlerName]();
    callback(null, success(response));
  } catch (error) {
    callback(error);
  }
};

export const up = handler("runMigration");

export const down = handler("undoLastMigration");
