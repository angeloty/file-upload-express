import { Connection, Repository, BaseEntity } from 'typeorm';
export class Service<T extends BaseEntity> {
  protected connection: Connection;
  protected repository: Repository<T>;
  constructor(conn: Connection) {
    this.connection = conn;
  }

  public getRepository(modelClass: new () => T): Repository<T> {
    try {
      this.repository = this.connection.getRepository<T>(modelClass);
      return this.repository;
    } catch (e) {
      throw e;
    }
  }
}
