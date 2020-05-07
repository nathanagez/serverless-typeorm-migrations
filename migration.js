const typeorm = require("typeorm");

class Migration {
  constructor(config, serverless) {
    this.config = config;
    this.serverless = serverless;
  }

  async init() {
    try {
      this.connection = await typeorm.createConnection(this.config);
      return 'Migrations done';
    } catch (error) {
      return (`Migrations [ERROR] - ${error}`);
    }
  }

  async runMigration() {
    try {
      await this.init();
      await this.connection.runMigrations({
        transaction: "none",
      });
      await this.connection.close();
      return 'Migrations done';
    } catch (error) {
      return (`Migrations [ERROR] - ${error}`);
    }
  }

  async undoLastMigration() {
    try {
      await this.init();
      await this.connection.undoLastMigration({
        transaction: "none",
      });
      await this.connection.close();
      return 'Migrations done';
    } catch (error) {
      return (`Migrations [ERROR] - ${error}`);
    }
  }
}

module.exports = Migration;
