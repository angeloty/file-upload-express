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
  public test(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    this.repository = getRepository(TestModel);
    response
      .json({})
      .send(200);
  }
}
