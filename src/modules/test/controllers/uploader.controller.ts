import BaseController from './../../../_core/_base/_controller/controller';
import * as express from 'express';
import { Post } from '../../../_core/_base/_controller/_decorators/route.decorator';
import { Controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';

@Controller({ path: 'uploader' })
export class UploaderController extends BaseController {
  constructor() {
    super();
  }

  @Post({
    path: 'upload',
    file: { path: 'file', multiple: false }
  })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const files: Express.Multer.File[] = await this.uploadFile(
        'file',
        request
      );
      return response
        .status(201)
        .send(files.map((f: Express.Multer.File) => f.filename));
    } catch (e) {
      return this.handleError(e, response);
    }
  }
}

export default UploaderController;
