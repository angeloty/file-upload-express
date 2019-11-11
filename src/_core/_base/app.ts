import { Module } from './module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import 'reflect-metadata';
import { createConnection, ConnectionOptions, DatabaseType } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

class App {
  public app: express.Application;
  public connection: any;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public async initializeModules(modules: Module[]) {
    try {
      let models: any[] = [];
      modules.forEach((module: Module) => {
        console.log(
          `Module: ${module.constructor.name} ......... Initializing`
        );
        this.app = module.init('/', this.app);
        models = [...models, module.getModels()];
      });
      console.log(
        `DB Connection: ${process.env.DB_ADAPTER.toLocaleUpperCase()} ......... Connecting`
      );
      this.connection = await this.initializeDB(models);
      console.log(
        `DB Connection: ${process.env.DB_ADAPTER.toLocaleUpperCase()} ......... Connected`
      );
      modules.forEach((module: Module) => {
        module.setConnection(this.app, this.connection);
      });
      return this;
    } catch (e) {
      console.log(e.message);
    }
  }

  public getServer() {
    return this.app;
  }

  public async initializeDB(models?: any[]) {
    switch (process.env.DB_ADAPTER) {
      case 'mysql':
      case 'mariadb':
        return await this.initializeMySqlDB(models);
      case 'mongodb':
        return await this.initializeMongoDB(models);
    }
  }

  private initializeMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private async initializeMySqlDB(models?: any[]) {
    try {
      const options: MysqlConnectionOptions = {
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
      };

      return await createConnection(options);
    } catch (e) {
      console.log(e.message);
    }
  }

  private async initializeMongoDB(models?: any[]) {
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

      return await createConnection(options);
    } catch (e) {
      console.log(e.message);
    }
  }
}

export default App;
