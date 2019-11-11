import { Route } from './_interfaces/route.interface';
import * as express from 'express';

export abstract class Controller {
  protected routes: Route[];
  protected router: express.Router;
  protected path: string;
  protected connection: any;
  protected app: express.Application;
  constructor(connection: any) {
    this.connection = connection;
    this.router = express.Router();
    this.loadRoutes();
  }

  public addRoute(route: Route) {
    if (!this.routes) {
      this.routes = [];
    }
    this.routes = [...this.routes, route];
  }

  public getRouter(): express.Router {
    return this.router;
  }

  public setPath(path: string) {
    this.path = path;
  }

  public getPath(): string {
    return this.path;
  }

  public setRouter(router: express.Router) {
    this.router = router;
  }

  public setConnection(connection: any) {
    this.connection = connection;
  }

  public setApp(app: any) {
    this.app = app;
  }

  private loadRoutes() {
    const prefix = this.getPath() ? this.getPath() : '';
    this.routes.forEach((route: Route) => {
      const path = prefix + '/' + route.path;
      if (route.middleware) {
        this.router[route.method](path, ...route.middleware, route.handler);
      } else {
        this.router[route.method](path, route.handler);
      }
      console.log(`Endpoint: ${route.method.toUpperCase()}-> "${path}" ....... Initialized`);
    });
  }
}

export default Controller;
