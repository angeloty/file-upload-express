import { Module } from "./_core/_base/module";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";

import errorMiddleware from "./_core/_auth/_middlewares/error.middleware";
import { DB } from "_core/_db/db";

class App {
  public app: express.Application;
  public db: DB;

  constructor() {
    this.app = express();
    this.db = new DB();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public initializeModules(modules: Module[]) {
    modules.forEach(module => {
      module.init(this.app);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToTheDatabase() {
    process.dbAdapter = this.app.dbAdapter = this.db.connect();    
  }
}

export default App;
