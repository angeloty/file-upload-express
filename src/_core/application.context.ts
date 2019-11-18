import { BaseUserModel } from './_auth/_models/user.model';
import { Module } from './_base/module';
import { securityContext } from './_base/_security/security.context';
import App from './_base/app';
import {
  RequestHandlerParams,
  ParamsDictionary
} from 'express-serve-static-core';
import configEnv from '../config/config';

export const ApplicationContext = {
  app: null,
  security: securityContext,
  init: <M extends Module, U extends BaseUserModel>(config: {
    modules: (new () => M)[];
    middleware?: (() => RequestHandlerParams<ParamsDictionary>)[];
    security?: { userModel: any };
  }) => {
    configEnv();
    this.app = new App();
    if (config.security) {
      securityContext.set(config.security);
    }
    try {
      this.app
        .init({
          modules: config.modules,
          middleware: config.middleware
        })
        .then((application: App) => {
          this.app = application;
          this.app.listen();
        });
    } catch (error) {
      console.log(error);
    }
  }
};

export default ApplicationContext;
