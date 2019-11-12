import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';
import { Connection, createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export class DBManager {
  public static initDB = async (models?: any): Promise<Connection> => {
    try {
      return await DBManager.connect(models);
    } catch (e) {
      throw e;
    }
  }

  public static connect = async (models?: any): Promise<Connection> => {
    try {
      switch (process.env.DB_ADAPTER) {
        case 'mysql':
        case 'mariadb':
          return await DBManager.connectMySql(models);
        case 'mongodb':
          return await DBManager.connectMongoDB(models);
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
      options = !options
        ? {
          name: 'my-connection',
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
      console.log('Connection options', options);
      return await createConnection(options);
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }

  public static connectMongoDB = async (models?: any): Promise<Connection> => {
    try {
      const options: MongoConnectionOptions = {
        name: 'my-connection',
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
      };
      console.log('Connection options', options);

      return await createConnection(options);
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }
}
