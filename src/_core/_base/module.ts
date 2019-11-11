import * as express from 'express';
import Controller from './_controller/controller';
export class Module {
  protected app: express.Application;
  protected path: string;
  protected controllers: Controller[];
  protected models: any[];
  constructor(controllers: Controller[], models: any[]) {
    this.controllers = controllers;
    this.models = models;
  }

  public init(path: string, app: express.Application): express.Application {
    this.app = app;
    this.path = path;
    this.app = this.initializeControllers(path);
    console.log(`Module: ${this.constructor.name} ......... Initialized`);
    return this.app;
  }

  public setConnection(app: express.Application, connection: any) {
    this.app = app;
    this.controllers.forEach((controller: Controller) => {
      controller.setConnection(connection);
      controller.setApp(app);
    });
  }

  public getModels() {
    return this.models;
  }

  private initializeControllers(path: string): express.Application {
    this.controllers.forEach((controller: Controller) => {
      this.app.use(path || '/', controller.getRouter());
      console.log(`Controller: ${controller.constructor.name} ......... Initialized`);
    });
    return this.app;
  }
}

export default Module;
