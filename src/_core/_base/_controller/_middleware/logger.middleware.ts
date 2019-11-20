import * as express from 'express';
export const loggerMiddleware = (
  req: express.Request,
  res: express.Response,
  next: Function
) => {
  console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
  next();
};
