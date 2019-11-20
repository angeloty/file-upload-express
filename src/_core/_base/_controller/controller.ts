import { applicationContext } from './../../application.context';
import { Route } from './_interfaces/route.interface';
import * as express from 'express';
import { Repository, ObjectLiteral, EntitySchema, Connection } from 'typeorm';
import HttpException from '../../_exceptions/HttpException';
import App from '../app';
import { CONTENT_TYPE } from './_decorators/route.decorator';
import * as Loki from 'lokijs';
import * as multer from 'multer';
import uploadMiddleware from './_middleware/uploader.middleware';
import { loggerMiddleware } from './_middleware/logger.middleware';

export abstract class BaseController {
  protected routes: Route[];
  protected router: express.Router;
  protected path: string;
  protected connection: Connection;
  protected app: App;
  constructor() {
    this.connection = applicationContext.connection;
    this.app = applicationContext.app;
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

  protected handleError(e: any, response: express.Response): express.Response {
    if (e instanceof HttpException) {
      return response.status(e.status).send(e.message);
    }
    if (e.status) {
      return response.status(e.status).send(e.message);
    }
    if (e.code === 1000) {
      return response.status(405).send(e.message);
    }
    console.log(e);
    return response.status(500).send(e.message);
  }

  protected async uploadFile(
    fileIndex: string,
    req: express.Request
  ): Promise<Express.Multer.File[]> {
    try {
      const col = await this.loadCollection(
        fileIndex,
        applicationContext.fileDB
      );
      let data: Loki.Collection<any>;
      data = col.insert(req.files);

      applicationContext.fileDB.saveDatabase();
      let files: Express.Multer.File[] = [];
      if (Array.isArray(req.files)) {
        files = req.files.map((f: Express.Multer.File) => f);
      } else {
        for (const i in req.files) {
          if (req.files.hasOwnProperty(i)) {
            files = [
              ...files,
              ...req.files[i].map((f: Express.Multer.File) => f)
            ];
          }
        }
      }
      return files;
    } catch (err) {
      throw err;
    }
  }

  private loadCollection(colName, db: Loki): Promise<Loki.Collection<any>> {
    return new Promise((resolve, reject) => {
      db.loadDatabase({}, () => {
        const collection =
          db.getCollection(colName) || db.addCollection(colName);
        resolve(collection);
      });
    });
  }

  private async upload(file: File): Promise<File> {
    try {
      return file;
    } catch (e) {
      throw e;
    }
  }

  private loadRoutes = () => {
    const prefix = this.getPath() ? '/' + this.getPath() : '';
    this.routes.forEach((route: Route) => {
      const path = prefix + '/' + route.path;
      if (!route.consume) {
        route.consume = CONTENT_TYPE.JSON;
      }
      switch (route.consume) {
        case CONTENT_TYPE.FILE:
          break;
        case CONTENT_TYPE.HTML:
          break;
        case CONTENT_TYPE.PLAIN_TEXT:
          break;
        default:
          break;
      }
      route.middleware = route.middleware
        ? [...route.middleware, loggerMiddleware]
        : [loggerMiddleware];

      if (route.file) {
        route.middleware = [...route.middleware, uploadMiddleware];
      }
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
        `Endpoint: ${route.method.toUpperCase()} (consume: ${
          route.consume
        })-> "${path}" ....... Initialized`
      );
    });
  }
}

export default BaseController;
