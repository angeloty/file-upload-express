import { Connection, BaseEntity } from 'typeorm';
import * as express from 'express';
import Controller from './_controller/controller';
import App from './app';
export class Module {
  protected app: express.Application;
  protected path: string;
  protected controllers: (new <C extends Controller>() => C)[];
  protected controllerInstances: any[] = [];
  protected models: (new <E extends BaseEntity>() => E)[];
  constructor(controllers: any[], models: any[]) {
    this.controllers = controllers;
    this.models = models;
  }

  public init = (
    path: string,
    app: express.Application,
    connection: Connection
  ): express.Application => {
    this.app = app;
    this.path = path;
    this.app = this.initializeControllers(path, connection, app);
    console.log(`Module: ${this.constructor.name} ......... Initialized`);
    return this.app;
  }

  public getModels() {
    return this.models;
  }

  private initializeControllers = <C extends Controller>(
    path: string,
    connection: Connection,
    app: express.Application
  ): express.Application => {
    this.controllers.forEach((c: new (conn: Connection) => C) => {
      console.log('cc:', c);
      c.prototype.connection = connection;
      const controller = new c(connection);
      console.log(`Controller: ${c.name} ......... Initialized`);
      this.controllerInstances = [...this.controllerInstances, controller];
      this.app.use(path || '/', controller.getRouter());
      console.log(
        `Routes for controller: ${c.name} ......... Loaded`
      );
      controller.setApp(app);
    });
    return this.app;
  }
}

export default Module;
