import { Repository } from 'typeorm';
import { TestModel } from './../models/test.model';
import Controller from './../../../_core/_base/_controller/controller';
import * as express from 'express';
import route, {
  HTTP_METHODS
} from '../../../_core/_base/_controller/_decorators/route.decorator';
import { controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';

@controller('test')
export class TestController extends Controller {
  private repository: Repository<TestModel>;
  constructor(connection: any) {
    super(connection);
  }

  @route({ path: 'test', method: HTTP_METHODS.GET })
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
