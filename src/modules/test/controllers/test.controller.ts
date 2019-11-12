import { TestModel } from './../models/test.model';
import Controller from './../../../_core/_base/_controller/controller';
import * as express from 'express';
import Route, {
  HTTP_METHODS
} from '../../../_core/_base/_controller/_decorators/route.decorator';
import { ControllerDecorator } from '../../../_core/_base/_controller/_decorators/controller.decorator';
import { getRepository } from 'typeorm';

@ControllerDecorator('test')
export class TestController extends Controller {
  private repository: any;
  constructor(connection: any) {
    super(connection);
  }

  @Route({ path: 'test', method: HTTP_METHODS.GET })
  public async test(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    console.log(this);
    try {
      this.repository = await this.getRepository<TestModel>(TestModel);
      response.json({}).send(200);
    } catch (e) {
      response.json({ error: e.message }).send(500);
    }
  }
}
