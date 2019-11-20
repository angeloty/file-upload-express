import * as express from 'express';
import applicationContext from '../../../application.context';
import { ParamsDictionary } from 'express-serve-static-core';
import HttpException from '../../../_exceptions/HttpException';

function uploadMiddleware(
  req: express.Request,
  res: express.Response,
  next: Function
) {
  try {
    applicationContext.uploader.any()(req, res, () => {
      if ('files' in req) {
        next();
      } else {
        throw new HttpException(400, 'Invalid File');
      }
    });
  } catch (e) {
    console.log(e);
  }
}

export default uploadMiddleware;
