import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../_auth/_exceptions/authenticationTokenMissing.exception';
import WrongAuthenticationTokenException from '../_auth/_exceptions/WrongAuthenticationToken.exception';
import DataStoredInToken from '../_auth/_interfaces/dataStoredInToken.interface';
import RequestWithUser from '../_auth/_interfaces/requestWithUser.interface';
import userModel from '../../../modules/user/user.model';

export async function authMiddleware(
  request: RequestWithUser,
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
      const user = await userModel.findById(id);
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
