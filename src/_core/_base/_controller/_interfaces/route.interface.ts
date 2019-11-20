import { HTTP_METHODS, CONTENT_TYPE } from './../_decorators/route.decorator';
import * as express from 'express';
export interface Route {
  path: string;
  method: HTTP_METHODS;
  middleware?: express.RequestHandler[];
  consume?: CONTENT_TYPE;
  produce?: CONTENT_TYPE;
  file?: {
    index?: string,
    multiple?: boolean
  };
  handler: express.RequestHandler;
}

export default Route;
