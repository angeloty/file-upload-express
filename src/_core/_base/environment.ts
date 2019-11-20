import 'reflect-metadata';
import { applicationContext } from '../application.context';
import App from './app';
import Module from './module';
import { RequestHandlerParams, ParamsDictionary } from 'express-serve-static-core';

export class Environment<M extends Module> {
  private app: App;
  private config: {
    modules: (new () => M)[];
    middleware?: (() => RequestHandlerParams<ParamsDictionary>)[];
    security?: { userModel: any };
    environment?: string
  };

  constructor(config: any) {
    this.config = config;
  }

  public run = async () => {
    this.app = await this.init();
    applicationContext.run(this.app);
  }

  public init = async (): Promise<App> => {
    this.app = await applicationContext.init({
      modules: this.config.modules,
      environment: this.config.environment,
      middleware: this.config.middleware,
      security: this.config.security
    });
    return this.app;
  }
}
