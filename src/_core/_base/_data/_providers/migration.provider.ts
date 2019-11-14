import { Connection } from 'typeorm';
export abstract class MigrationProvider {
  protected connection: Connection;
  constructor(conn: Connection) {
    this.connection = conn;
  }
  public abstract async up(): Promise<void>;
  public abstract async down(): Promise<void>;
}
