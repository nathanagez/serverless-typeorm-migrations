const Migration = require("./migration");

class ServerlessTypeOrmMigration {
  constructor(serverless, options) {
    this.serverless = serverless;

    this.options = options;
    this.log = (message) =>
      this.serverless.cli.log(`Serverless Migrations - ${message}`);

    this.commands = {
      migrate: {
        usage: "",
        lifecycleEvents: ["help"],
        commands: {
          up: {
            usage: "Runs forward migrations",
            lifecycleEvents: ["migrate"],
          },
          down: {
            usage: "Rolls back migration",
            lifecycleEvents: ["rollback"],
          },
        },
      },
    };

    this.hooks = {
      "migrate:help": this.missingArguments.bind(this),
      "migrate:up:migrate": this.migrate.bind(this),
      "migrate:down:rollback": this.rollback.bind(this),
    };
  }

  missingArguments() {
    this.log(`Missing arguments run serverless migrate --help`);
  }

  afterDeploy() {
    if (this.options.function) {
      this.log(`Calling migration function: ${this.options.function}`);
      this.serverless.pluginManager.invoke(["invoke"]);
    } else {
      this.log("No migration function defined");
      this.log("Specify a function name using the --function / -f option.");
    }
  }

  async migrate() {
    this.log("Starting migrations");
    const migration = new Migration(
      {
        type: this.getEngine(),
        url: this.getDatabaseConnectionString(),
        migrations: [this.getMigrationFolder()],
      }
    );
    const result = await migration.runMigration();
    this.log(result);
  }

  async rollback() {
    this.log("Starting migrations revert");
    const migration = new Migration(
      {
        type: this.getEngine(),
        url: this.getDatabaseConnectionString(),
        migrations: [this.getMigrationFolder()],
      }
    );
    const result = await migration.undoLastMigration();
    this.log(result);
  }

  getDatabaseConnectionString() {
    if (!process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL) {
      this.log("SLS_TYPEORM_MIGRATION_DATABASE_URL environment variable required");
      process.exit(1);
    }

    return process.env.SLS_TYPEORM_MIGRATIONS_DATABASE_URL;
  }

  getEngine() {
    if (!process.env.SLS_TYPEORM_MIGRATIONS_ENGINE) {
      this.log("SLS_TYPEORM_MIGRATION_DATABASE_URL environment variable required");
      process.exit(1);
    }

    return process.env.SLS_TYPEORM_MIGRATIONS_ENGINE;
  }

  getMigrationFolder() {
    if (!process.env.SLS_TYPEORM_MIGRATIONS_FOLDER) {
      this.log("SLS_TYPEORM_MIGRATION_FOLDER environment variable required");
      process.exit(1);
    }

    return process.env.SLS_TYPEORM_MIGRATIONS_FOLDER;
  }
}

module.exports = ServerlessTypeOrmMigration;
