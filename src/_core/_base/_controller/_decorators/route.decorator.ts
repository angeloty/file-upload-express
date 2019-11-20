import { securityContext } from './../../_security/security.context';
import { BaseUserModel } from './../../../_auth/_models/user.model';
import * as express from 'express';
export enum HTTP_METHODS {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}
export enum CONTENT_TYPE {
  JSON = 'application/json',
  FILE = 'multipart/form-data',
  PLAIN_TEXT = 'text/plain',
  HTML = 'text/html',
}
import 'reflect-metadata';
import Controller from '../controller';
import roleMiddleware from '../../_security/_middleware/role.middleware';
import authMiddleware from '../../_security/_middleware/auth.middleware';
import { ROLE } from '../../_security/_interfaces/roles.enum';

export interface IBaseRouteConfig {
  path: string;
  method?: HTTP_METHODS;
  roles?: ROLE[];
  file?: {
    path: string,
    multiple: boolean
  };
  secured?: boolean;
}
export interface IRouteConfig extends IBaseRouteConfig {
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
    const app = target.getApp();
    if (config.secured || config.roles) {
      middleware.push(
        authMiddleware
      );
    }
    if (config.roles && config.roles.length) {
      middleware.push(
        roleMiddleware.bind(
          {},
          config.roles
        )
      );
    }
    if (middleware.length) {
      target.addRoute({
        middleware,
        path: config.path,
        method: config.method,
        file: config.file,
        handler: descriptor.value
      });
    } else {
      target.addRoute({
        path: config.path,
        method: config.method,
        file: config.file,
        handler: descriptor.value
      });
    }
  };
}

export function Get(
  config: IBaseRouteConfig,
  ...middleware: express.RequestHandler[]
): (
  target: Controller,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  config.method = HTTP_METHODS.GET;
  return Route(config as IRouteConfig, ...middleware);
}

export function Post(
  config: IBaseRouteConfig,
  ...middleware: express.RequestHandler[]
): (
  target: Controller,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  config.method = HTTP_METHODS.POST;
  return Route(config as IRouteConfig, ...middleware);
}

export function Patch(
  config: IBaseRouteConfig,
  ...middleware: express.RequestHandler[]
): (
  target: Controller,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  config.method = HTTP_METHODS.PATCH;
  return Route(config as IRouteConfig, ...middleware);
}

export function Put(
  config: IBaseRouteConfig,
  ...middleware: express.RequestHandler[]
): (
  target: Controller,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  config.method = HTTP_METHODS.PUT;
  return Route(config as IRouteConfig, ...middleware);
}

export function Delete(
  config: IBaseRouteConfig,
  ...middleware: express.RequestHandler[]
): (
  target: Controller,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  config.method = HTTP_METHODS.DELETE;
  return Route(config as IRouteConfig, ...middleware);
}

export default Route;
