import { BaseUserInterface } from './../_models/_data/userRequest.interface';
import { Request } from 'express';
export interface RequestWithUser<U extends BaseUserInterface> extends Request {
  user: U;
}
