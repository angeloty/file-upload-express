import { RequestWithUser } from './../_interfaces/requestWithUser.interface';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../_interfaces/dataStoredInToken.interface';
import WrongAuthenticationTokenException from '../_exceptions/wrongAuthenticationToken.exception';
import AuthenticationTokenMissingException from '../_exceptions/authenticationTokenMissing.exception';
import { getRepository } from 'typeorm';
import { BaseUserModel } from '../../../_auth/_models/user.model';
async function authMiddleware<U extends BaseUserModel>(
  request: RequestWithUser<U>,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        cookies.Authorization,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const repository = getRepository<U>(BaseUserModel as unknown as (new () => U));
      const user = await repository.findOne(id);
      if (user) {
        request.user = user;
        next();
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

export default authMiddleware;
