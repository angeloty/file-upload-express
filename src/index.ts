import { UserModel } from './modules/user/models/user.model';
import { securityContext } from './_core/_base/_security/security.context';
import { UserModule } from './modules/user/user.module';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import configEnv from './config/config';
import App from './_core/_base/app';
import { TestModule } from './modules/test/test.module';

configEnv();
securityContext.set({
  userModel: UserModel as any
});
let app: App = new App();
try {
  app
    .init({
      modules: [TestModule, UserModule],
      middleware: [express.json, cookieParser]
    })
    .then((application: App) => {
      app = application;
      app.listen();
    });
} catch (error) {
  console.log(error);
}
