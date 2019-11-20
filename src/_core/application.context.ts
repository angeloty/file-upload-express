import * as multer from 'multer';
import * as Loki from 'lokijs';
import { BaseUserModel } from './_auth/_models/user.model';
import { Module } from './_base/module';
import { securityContext } from './_base/_security/security.context';
import App from './_base/app';
import {
  RequestHandlerParams,
  ParamsDictionary
} from 'express-serve-static-core';
import configEnv from '../config/config';
import { Connection } from 'typeorm';

export interface IApplicationContext {
  app: App;
  connection: Connection;
  security: {};
  uploader: any;
  fileDB: any;
  init: Function;
  run: Function;
}

export const applicationContext: IApplicationContext = {
  app: null,
  connection: null,
  security: securityContext,
  uploader: null,
  fileDB: null,
  init: async <M extends Module>(config: {
    modules: (new () => M)[];
    middleware?: (() => RequestHandlerParams<ParamsDictionary>)[];
    security?: { userModel: any };
    environment?: string;
  }): Promise<App> => {
    if (!config.environment) {
      config.environment = 'development';
    }
    process.env.NODE_ENV = config.environment;
    configEnv();
    const DB_NAME = 'db.json';
    const UPLOAD_PATH = process.env.UPLOAD_DIR || 'uploads/';
    applicationContext.uploader = multer({ dest: `${UPLOAD_PATH}` }); // multer configuration
    applicationContext.fileDB = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, {
      persistenceMethod: 'fs'
    });
    if (config.security) {
      securityContext.set(config.security);
    }
    try {
      const app = new App();
      return await app.init({
        modules: config.modules,
        middleware: config.middleware
      });
    } catch (error) {
      console.log(error);
    }
  },
  run(app: App) {
    return app.listen();
  }
};

export default applicationContext;
