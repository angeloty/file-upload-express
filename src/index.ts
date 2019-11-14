import { UserModel } from './modules/user/models/user.model';
import { UserModule } from './modules/user/user.module';
import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { TestModule } from './modules/test/test.module';
import { ApplicationContext } from './_core/application.context';

ApplicationContext.init({
  modules: [TestModule, UserModule],
  middleware: [express.json, cookieParser],
  security: {
    userModel: UserModel as any
  }
});
