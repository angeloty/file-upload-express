import { UserService } from './../services/user.services';
import { Connection } from 'typeorm';
import { UserModel } from './../models/user.model';
import { controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';
import { BaseUserController } from '../../../_core/_auth/_controllers/user.controller';

@controller('users')
export class UserController extends BaseUserController<UserModel, UserService> {
  constructor(conn: Connection) {
    super(conn, UserModel);
  }
}
