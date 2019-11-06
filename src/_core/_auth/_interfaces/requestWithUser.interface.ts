import { User } from '../_models/user';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
