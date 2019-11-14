import { DBManager } from '../_data/_providers/dbManager.provider';
import { Route } from './_interfaces/route.interface';
import * as express from 'express';
import {
  Repository,
  Entity,
  ObjectLiteral,
  getRepository,
  EntitySchema,
  Connection
} from 'typeorm';
import HttpException from '../../_exceptions/HttpException';

export abstract class Controller {
  protected routes: Route[];
  protected router: express.Router;
  protected path: string;
  protected connection: Connection;
  protected app: express.Application;
  constructor(connection?: Connection, app?: express.Application) {
    this.connection = connection;
    this.app = app;
    this.router = express.Router();
    this.loadRoutes();
  }

  public addRoute(route: Route) {
    if (!this.routes) {
      this.routes = [];
    }
    this.routes = [...this.routes, route];
  }

  public getRouter = (): express.Router => {
    return this.router;
  }

  public setPath(path: string) {
    this.path = path;
  }

  public getPath(): string {
    return this.path;
  }

  public setRouter = (router: express.Router) => {
    this.router = router;
  }

  public setConnection = (connection: any) => {
    this.connection = connection;
  }

  public setApp = (app: any) => {
    this.app = app;
  }

  protected async getRepository<T extends ObjectLiteral>(
    model: string | Function | EntitySchema<T>
  ): Promise<Repository<T>> {
    try {
      if (!this.connection.isConnected) {
        this.connection = await this.connection.connect();
      }
      return this.connection.getRepository<T>(model);
    } catch (e) {
      throw e;
    }
  }

  protected handleError(e: Error, response: express.Response): express.Response {
    if (e instanceof HttpException) {
      return response.status(e.status).send(e.message);
    }
    return response.status(500).send(e.message);
  }

  private loadRoutes = () => {
    const prefix = this.getPath() ? '/' + this.getPath() : '';
    this.routes.forEach((route: Route) => {
      const path = prefix + '/' + route.path;
      if (route.middleware) {
        this.router[route.method](
          path,
          ...route.middleware,
          route.handler.bind(this)
        );
      } else {
        this.router[route.method](path, route.handler.bind(this));
      }
      console.log(
        `Endpoint: ${route.method.toUpperCase()}-> "${path}" ....... Initialized`
      );
    });
  }
}

export default Controller;
