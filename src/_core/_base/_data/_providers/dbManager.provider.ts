import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export class DBManager {
  public static initDB = async (models?: any): Promise<Connection> => {
    try {
      return await DBManager.connect(models);
    } catch (e) {
      throw e;
    }
  }

  public static connect = async (
    models?: any,
    options?: ConnectionOptions
  ): Promise<Connection> => {
    try {
      switch (process.env.DB_ADAPTER) {
        case 'mysql':
        case 'mariadb':
          return await DBManager.connectMySql(
            models,
            options as MysqlConnectionOptions
          );
        case 'mongodb':
          return await DBManager.connectMongoDB(
            models,
            options as MongoConnectionOptions
          );
      }
    } catch (e) {
      throw e;
    }
  }

  public static connectMySql = async (
    models?: any,
    options?: MysqlConnectionOptions
  ): Promise<Connection> => {
    try {
      const opt = !options
        ? {
          name: process.env.DB_ADAPTER,
          type: process.env.DB_ADAPTER as 'mysql' | 'mariadb',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          synchronize: true,
          logging: false,
          entities: models
              ? models
              : ['src/models/**/*.ts', 'src/modules/**/models/**/*.ts'],
          migrations: [
            'src/migration/**/*.ts',
            'src/modules/**/migration/**/*.ts'
          ],
          subscribers: [
            'src/subscriber/**/*.ts',
            'src/modules/**/subscriber/**/*.ts'
          ],
          cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber'
          }
        }
        : options;
      console.log('Connection options', opt);
      return await createConnection(opt);
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }

  public static connectMongoDB = async (
    models?: any,
    options?: MongoConnectionOptions
  ): Promise<Connection> => {
    try {
      const opt: MongoConnectionOptions = !options
        ? {
          name: process.env.DB_ADAPTER,
          type: process.env.DB_ADAPTER as 'mongodb',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          synchronize: true,
          logging: false,
          entities: models
              ? models
              : ['src/models/**/*.ts', 'src/modules/**/models/**/*.ts'],
          migrations: [
            'src/migration/**/*.ts',
            'src/modules/**/migration/**/*.ts'
          ],
          subscribers: [
            'src/subscriber/**/*.ts',
            'src/modules/**/subscriber/**/*.ts'
          ],
          cli: {
            entitiesDir: 'src/entity',
            migrationsDir: 'src/migration',
            subscribersDir: 'src/subscriber'
          }
        }
        : options;
      return await createConnection(opt);
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }
}
