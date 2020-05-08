import { createConnection, Connection, ConnectionOptions } from "typeorm";

interface MigrationIndexSignature {
  [key: string]: any;
}

export default class Migration implements MigrationIndexSignature {
  private config: ConnectionOptions;
  private connection: Connection | null;
  [handlerName: string]: any;
  
  constructor(config: ConnectionOptions) {
    this.config = config;
    this.connection = null;
  }

  private async init() {
    try {
      this.connection = await createConnection(this.config);
    } catch (error) {
      throw error;
    }
  }

  async runMigration() {
    try {
      await this.init();
      const result = await this.connection?.runMigrations({
        transaction: "none",
      });
      await this.connection?.close();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async undoLastMigration() {
    try {
      await this.init();
      await this.connection?.undoLastMigration({
        transaction: "none",
      });
      await this.connection?.close();
    } catch (error) {
      throw error;
    }
  }
}
