const Migration = require("./migration");

const success = (response) => ({
  statusCode: 200,
  body: JSON.stringify(response),
});

const failure = (response) => ({
  statusCode: 500,
  body: JSON.stringify(response),
});

const handler = (handlerName) => async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const migration = new Migration(
    {
      type: process.env.SLS_TYPEORM_MIGRATIONS_ENGINE,
      url: process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL,
      migrations: [process.env.SLS_TYPEORM_MIGRATIONS_OLDER],
    },
    this.serverless
  );

  try {
    const response = await migration[handlerName]();
    callback(null, success(response));
  } catch (error) {
    callback(error);
  }
};

module.exports.up = handler("runMigration");

module.exports.down = handler("undoLastMigration");
