[![Serverless Application Framework AWS Lambda API Gateway](https://s3.amazonaws.com/assets.github.serverless/readme-serverless-framework.gif)](http://serverless.com)
# Serverless TypeORM Migrations

Database migrations for AWS Lambda and RDS using [TypeORM Migrations](https://typeorm.io/#/migrations).

## About

This Serverless plugin can execute and rollback database migrations after deploys. See [Usage](#usage)

This plugin supports MySQL / MariaDB / Postgres / CockroachDB / SQLite / Microsoft SQL Server / sql.js

> Inspired by [serverless-pg-migrations](https://github.com/Nevon/serverless-pg-migrations). I use TypeORM so I wrote my own plugin

**NOTES:**

  * This plugin does not attempt to add handlers automatically (see [Adding handlers](#usage))
  * This plugin does not create or drop databases
  * This plugin does not have a handler for checking database connection

## Migrations

You need to specify your `migration` folder

For details on using migrations please see the [TypeORM Migration](https://typeorm.io/#/migrations) docs.

## Installation

```bash
$ serverless-typeorm-migrations
```
OR 
```bash
$ npm install serverless-typeorm-migrations
```

## Usage

Define a migration handler somewhere in your project. Example:

```js
// /migrations.js

const { up, down } = require("serverless-typeorm-migrations/handlers");

module.exports.up = up;

module.exports.down = down;
```

```ts
// /migrations.ts

import * as handlers from 'serverless-typeorm-migrations/handlers'

export const up = handlers.up;
export const down = handlers.down;

```

Add the plugin and handlers to your `serverless.yml`:

```yml
provider:
  name: aws

plugins:
  - serverless-typeorm-migrations

functions:
  up:
    handler: migrations.up
    timeout: 30
    environment:
      SLS_TYPEORM_MIGRATIONS_ENGINE: "postgres"
      SLS_TYPEORM_MIGRATION_DATABASE_URL: "postgres://root:password@domain.rds.amazonaws.com:5432/database"
      SLS_TYPEORM_MIGRATION_OLDER: "src/migration/**/*.js"
  down:
    handler: migrations.down
    timeout: 30
    environment:
      SLS_TYPEORM_MIGRATIONS_ENGINE: "postgres"
      SLS_TYPEORM_MIGRATION_DATABASE_URL: "postgres://root:password@domain.rds.amazonaws.com:5432/database"
      SLS_TYPEORM_MIGRATION_OLDER: "src/migration/**/*.js"
```

Pass the function to the serverless deploy command to have it execute after the deploy is finished:

```
sls deploy --function up
```

You can also manually invoke the functions locally:

```
sls invoke local --function up
```

Or use the plugin directly without going through your function:

```
sls migrate up
sls migrate down
```

## Configuration

The functions need to have the following environment variables :
- `SLS_TYPEORM_MIGRATIONS_DATABASE_URL` set to a valid [connection uri](https://typeorm.io/#/connection/creating-a-new-connection).
- `SLS_TYPEORM_MIGRATIONS_FOLDER` pointing migrations folder
- `SLS_TYPEORM_MIGRATIONS_ENGINE` defining database driver

## NestJS example

If you are using NestJS with serverless framework you have to create a `ormconfig.js` file in your root folder within the following content to generate migration:

```js
module.exports = {
  type: 'your_driver',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['your_entities_folder/**/*.ts'],
  migrations: ['your_migrations_folder/**/*.ts'],
  subscribers: ['your_subscribers_folder/**/*.ts'],
  cli: {
    entitiesDir: 'your_entities_folder',
    migrationsDir: 'your_migrations_folder',
    subscribersDir: 'your_subscribers_folder',
  },
};

```
Don't forget to set `synchronize` to `false` in your TypeORM configuration


Next you have to transpile .ts migration files to .js to make it work before deploying or invoking functions related to this plugin and finally, configure the plugin with these [environment variables](#configuration)