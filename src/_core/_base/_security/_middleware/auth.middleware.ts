import { securityContext } from './../security.context';
import { UserProvider } from './../_providers/user.provider';
import { RequestWithUser } from './../_interfaces/requestWithUser.interface';
import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import DataStoredInToken from '../_interfaces/dataStoredInToken.interface';
import WrongAuthenticationTokenException from '../_exceptions/wrongAuthenticationToken.exception';
import AuthenticationTokenMissingException from '../_exceptions/authenticationTokenMissing.exception';
import { getConnection } from 'typeorm';
import { BaseUserModel } from '../../../_auth/_models/user.model';
async function authMiddleware(
  request: RequestWithUser<BaseUserModel>,
  response: Response,
  next: NextFunction
) {
  const secret = process.env.JWT_SECRET;
  let token = null;
  if (
    request.headers.authorization &&
    request.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = request.headers.authorization.split(' ')[1];
  } else if (request.query && request.query.token) {
    token = request.query.token;
  } else if (request.cookies && request.cookies.Authorization) {
    token = request.cookies.Authorization;
  }
  if (token) {
    try {
      const verificationResponse = jwt.verify(
        token,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const connection = getConnection(process.env.DB_ADAPTER);
      const user = await UserProvider.find(connection, securityContext.userModel, id);
      request.user = user;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
