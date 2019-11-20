import { UserService } from './../services/user.services';
import { UserModel } from './../models/user.model';
import { Controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';
import { BaseUserController } from '../../../_core/_auth/_controllers/user.controller';

@Controller({ path: 'users' })
export class UserController extends BaseUserController<UserModel, UserService> {
  constructor() {
    super(UserModel);
  }
}
