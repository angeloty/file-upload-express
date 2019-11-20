import { applicationContext, IApplicationContext } from './../application.context';
import { BaseUserModel } from './../_auth/_models/user.model';
import { Module } from './module';
import * as express from 'express';
import 'reflect-metadata';
import { Connection } from 'typeorm';
import { DBManager } from './_data/_providers/dbManager.provider';
import {
  RequestHandlerParams,
  ParamsDictionary
} from 'express-serve-static-core';

class App {
  public app: express.Application;
  public connection: Connection;
  public moduleInstances: Module[] = [];
  public userModel: new <U extends BaseUserModel>() => U;
  public context: IApplicationContext;

  constructor() {
    this.app = express();
    this.context = applicationContext;
    this.context.app = this;
  }

  public listen = (): void => {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public init = async <M extends Module, U extends BaseUserModel>(config: {
    modules: (new () => M)[];
    middleware?: (() => RequestHandlerParams<ParamsDictionary>)[];
  }): Promise<App> => {
    this.initializeMiddleware(config.middleware);
    return await this.initializeModules(config.modules);
  }

  public getServer = (): express.Application => {
    return this.app;
  }

  private initializeModules = async <M extends Module>(
    modules: (new () => M)[]
  ): Promise<App> => {
    try {
      let models: any[] = [];
      modules.forEach((mClass: new () => M) => {
        const module = new mClass();
        this.moduleInstances = [...this.moduleInstances, module];
        console.log(
          `Module: ${module.constructor.name} ......... Initializing`
        );
        if (module.getModels()) {
          models = [...models, ...module.getModels()];
        }
      });
      console.log(
        `DB Connection: ${process.env.DB_ADAPTER.toLocaleUpperCase()} ......... Connecting`
      );
      this.connection = await this.initializeDB(models);
      this.context.connection = this.connection;
      console.log(
        `DB Connection: ${process.env.DB_ADAPTER.toLocaleUpperCase()} ......... Connected`
      );
      for (const module of this.moduleInstances) {
        this.app = await module.init('/', this, this.connection);
      }
      return this;
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }

  private initializeDB = async (models?: any[]): Promise<Connection> => {
    try {
      return await DBManager.initDB(models);
    } catch (e) {
      throw e;
    }
  }

  private initializeMiddleware = (
    middleware?: (() => RequestHandlerParams<ParamsDictionary>)[]
  ): App => {
    if (middleware) {
      middleware.forEach(
        (mid: () => RequestHandlerParams<ParamsDictionary>) => {
          this.app.use(mid());
        }
      );
    }
    return this;
  }
}

export default App;
