import { Module } from './module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import 'reflect-metadata';
import { Connection } from 'typeorm';
import { DBManager } from './_data/db-manager';

class App {
  public app: express.Application;
  public connection: Connection;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
  }

  public listen = (): void => {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public initializeModules = async (modules: Module[]): Promise<App> => {
    try {
      let models: any[] = [];
      modules.forEach((module: Module) => {
        console.log(
          `Module: ${module.constructor.name} ......... Initializing`
        );
        this.app = module.init('/', this.app);
        models = [...models, ...module.getModels()];
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
      throw e;
    }
  }

  public getServer = (): express.Application => {
    return this.app;
  }

  public initializeDB = async (models?: any[]): Promise<Connection> => {
    try {
      return await DBManager.initDB(models);
    } catch (e) {
      throw e;
    }
  }

  private initializeMiddleware = (): void => {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }
}

export default App;
