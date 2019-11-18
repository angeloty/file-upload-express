import { Route } from './_interfaces/route.interface';
import * as express from 'express';
import {
  Repository,
  ObjectLiteral,
  EntitySchema,
  Connection
} from 'typeorm';
import HttpException from '../../_exceptions/HttpException';
import App from '../app';
import Busboy = require('busboy');

export abstract class Controller {
  protected routes: Route[];
  protected router: express.Router;
  protected path: string;
  protected connection: Connection;
  protected app: App;
  constructor(connection?: Connection, app?: App) {
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

  public getApp() {
    return this.app;
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

  protected handleError(
    e: Error,
    response: express.Response
  ): express.Response {
    if (e instanceof HttpException) {
      return response.status(e.status).send(e.message);
    }
    return response.status(500).send(e.message);
  }

  protected async uploadFile(
    req: express.Request,
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      if (req.method === 'POST') {
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('file', (fIndex, file, filename, encoding, mimetype) => {
          file.on('data', (data) => {
            console.log('File [' + fIndex + '] got ' + data.length + ' bytes');
          });
          file.on('end', () => {
            console.log('File [' + fIndex + '] Finished');
            resolve(file);
          });
        });
        req.pipe(busboy);
      } else {
        throw new HttpException(405, 'Invalid request format');
      }
    });
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
