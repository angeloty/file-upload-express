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
import roleMiddleware from '../../_security/_middleware/role.middleware';
import authMiddleware from '../../_security/_middleware/auth.middleware';
import { ROLE } from '../../_security/_interfaces/roles.enum';
export interface IRouteConfig {
  path: string;
  method: HTTP_METHODS;
  roles?: ROLE[];
  secured?: boolean;
}
export function route(
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
    if (config.secured) {
      middleware.push(authMiddleware);
    }
    if (config.roles && config.roles.length) {
      middleware.push(roleMiddleware.bind(this, config.roles));
    }
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

export default route;
