import { Connection } from 'typeorm';
import { UserModel } from './../models/user.model';
import * as express from 'express';
import route, {
  HTTP_METHODS
} from '../../../_core/_base/_controller/_decorators/route.decorator';
import { controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';
import { BaseUserController } from '../../../_core/_auth/_controllers/user.controller';

@controller('users')
export class UserController extends BaseUserController<UserModel> {
  constructor(conn: Connection) {
    super(conn, UserModel);
  }
}
