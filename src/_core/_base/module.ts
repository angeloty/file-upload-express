import * as express from 'express';
import Controller from './_controller/controller';
export class Module {
  protected app: express.Application;
  protected path: string;
  protected controllers: Controller[];
  constructor() {}

  public init(app: express.Application) {
    this.app = app;
    this.initializeControllers();
  }

  private initializeControllers() {
    this.controllers.forEach((controller: Controller) => {
      this.app.use(this.path, controller.getRouter());
    });
  }
}

export default Module;
