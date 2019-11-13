import { UserModel } from './models/user.model';
import { UserController } from './controllers/user.controller';
import { Module } from '../../_core/_base/module';
export class UserModule extends Module {
  constructor(connection?: any) {
    super([
      UserController
    ],    [
      UserModel
    ]);
  }
}
