import { HTTP_METHODS } from './../_decorators/route.decorator';
import * as express from 'express';
export interface Route {
  path: string;
  method: HTTP_METHODS;
  middleware?: express.RequestHandler[];
  file?: string;
  handler: express.RequestHandler;
}

export default Route;
