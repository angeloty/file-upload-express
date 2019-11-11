import * as express from 'express';
export enum HTTP_METHODS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}
import 'reflect-metadata';
import Controller from '../controller';
export interface IRouteConfig {
  path: string;
  method: HTTP_METHODS;
}
export function Route(
  config: IRouteConfig,
  ...middleware: express.RequestHandler[]
): (
  target: Controller,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  return function registerProperty(
    target: Controller,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    if (middleware.length) {
      target.addRoute({
        middleware,
        path: config.path,
        method: config.method,
        handler: descriptor.value
      });
    } else {
      target.addRoute({
        path: config.path,
        method: config.method,
        handler: descriptor.value
      });
    }
  };
}

export default Route;
