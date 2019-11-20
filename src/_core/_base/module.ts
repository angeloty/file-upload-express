import { Connection, BaseEntity } from 'typeorm';
import * as express from 'express';
import Controller from './_controller/controller';
import App from './app';
import { MigrationProvider } from './_data/_providers/migration.provider';
export class Module {
  protected app: App;
  protected path: string;
  protected controllers: (new <C extends Controller>() => C)[];
  protected migrations: (new <M extends MigrationProvider>(
    conn: Connection
  ) => M)[];
  protected controllerInstances: any[] = [];
  protected models: (new <E extends BaseEntity>() => E)[];
  constructor(config: {
    controllers: any[];
    models?: any[];
    migrations?: any[];
  }) {
    this.controllers = config.controllers;
    this.models = config.models;
    this.migrations = config.migrations;
  }

  public init = async (
    path: string,
    app: App,
    connection: Connection
  ): Promise<express.Application> => {
    this.app = app;
    this.path = path;
    this.app = this.initializeControllers(path, connection, app);
    this.app = await this.runMigrations(connection, app);
    console.log(`Module: ${this.constructor.name} ......... Initialized`);
    return this.app.app;
  }

  public getModels() {
    return this.models;
  }

  private initializeControllers = <C extends Controller>(
    path: string,
    connection: Connection,
    app: App
  ): App => {
    this.controllers.forEach((c: new () => C) => {
      const controller = new c();
      console.log(`Controller: ${c.name} ......... Initialized`);
      this.controllerInstances = [...this.controllerInstances, controller];
      this.app.app.use(path || '/', controller.getRouter());
      console.log(`Routes for controller: ${c.name} ......... Loaded`);
      controller.setApp(app);
    });
    return this.app;
  }

  private async runMigrations<M extends MigrationProvider>(
    connection: Connection,
    app: App
  ): Promise<App> {
    if (this.migrations) {
      for (const m of this.migrations) {
        const migration = new m(connection);
        console.log(`Migration: ${m.name} ......... Running`);
        await migration.up();
        console.log(`Migration: ${m.name} ......... Loaded`);
      }
    }
    return this.app;
  }
}

export default Module;
