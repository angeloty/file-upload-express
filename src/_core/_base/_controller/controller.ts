import { Router } from 'express';

export abstract class Controller {
  protected router: Router;
  protected path: string;
  constructor() {
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  protected abstract initializeRoutes(): void;
}

export default Controller;
