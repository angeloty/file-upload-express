import { RequestWithUser } from './../_interfaces/requestWithUser.interface';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../_interfaces/dataStoredInToken.interface';
import WrongAuthenticationTokenException from '../_exceptions/wrongAuthenticationToken.exception';
import AuthenticationTokenMissingException from '../_exceptions/authenticationTokenMissing.exception';
import { getRepository, BaseEntity } from 'typeorm';
import { BaseUserModel } from '../../../_auth/_models/user.model';
import ForbiddenException from '../_exceptions/forbidden.exception';
import { ROLE } from '../_interfaces/roles.enum';
async function roleMiddleware<U extends BaseUserModel>(
  roles: ROLE[],
  request: RequestWithUser<U>,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const user = request.user;
      if (user) {
        let forbidden = true;
        if (user.roles) {
          for (const role of user.roles) {
            if (roles.some((r: ROLE) => r === role)) {
              forbidden = false;
              break;
            }
          }
        }
        if (!forbidden) {
          next();
        } else {
          next(new ForbiddenException());
        }
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default roleMiddleware;
