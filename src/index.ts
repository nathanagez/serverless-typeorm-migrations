import Migration from "./migration";
import {
  getEngine,
  getDatabaseConnectionString,
  getMigrationFolder,
  logMigrations,
} from "./utils";

class ServerlessTypeOrmMigration {
  private serverless: any;
  private options: any;
  private commands: {};
  private hooks: {};
  private log: (message: string) => void;

  constructor(serverless: any, options: any) {
    this.serverless = serverless;

    this.options = options;
    this.log = (message: any) =>
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
    this.log("Looking for migrations");
    const migration = new Migration({
      type: getEngine(this.log),
      url: getDatabaseConnectionString(this.log),
      migrations: [getMigrationFolder(this.log)],
    });
    const migrations = await migration.runMigration();
    logMigrations(this.log, migrations);
  }

  async rollback() {
    this.log("Undoing last migration");
    const migration = new Migration({
      type: getEngine(this.log),
      url: getDatabaseConnectionString(this.log),
      migrations: [getMigrationFolder(this.log)],
    });
    await migration.undoLastMigration();
    this.log("Done.");
  }
}

module.exports = ServerlessTypeOrmMigration;
