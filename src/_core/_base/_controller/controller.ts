import { Router } from "../router";

export abstract class Controller {
  protected router: Router;
  protected path: string;
  constructor() {
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  public getRouter(): Router {
    return this.router;
  }
}

export default Controller;
