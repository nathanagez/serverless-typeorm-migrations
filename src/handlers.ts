import Migration from "./migration";
import { Context, Callback } from "aws-lambda";
import { getConnectionOptions } from "./utils";

const success = (response: any) => ({
  statusCode: 200,
  body: JSON.stringify(response),
});

const handler = (handlerName: string) => async (
  event: any,
  context: Context,
  callback: Callback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const migration = new Migration(getConnectionOptions(console.error));

  try {
    const response = await migration[handlerName]();
    callback(null, success(response));
  } catch (error) {
    callback(error);
  }
};

const up = handler("runMigration");
const down = handler("undoLastMigration");

export { up, down };
