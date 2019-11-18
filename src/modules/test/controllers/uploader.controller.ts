import { Repository, DeleteResult } from 'typeorm';
import { TestModel } from './../models/test.model';
import Controller from './../../../_core/_base/_controller/controller';
import * as express from 'express';
import route, {
  HTTP_METHODS
} from '../../../_core/_base/_controller/_decorators/route.decorator';
import { controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';

@controller('uploader')
export class UploaderController extends Controller {
  private repository: Repository<TestModel>;
  constructor(connection: any) {
    super(connection);
  }

  @route({ path: 'upload', method: HTTP_METHODS.POST })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const file: File = await this.uploadFile(request);
      return response.status(201).send(file.name);
    } catch (e) {
      return this.handleError(e, response);
    }
  }
}

export default UploaderController;
