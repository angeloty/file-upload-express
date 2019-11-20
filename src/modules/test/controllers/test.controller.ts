import { TestModel } from './../models/test.model';
import BaseController from './../../../_core/_base/_controller/controller';
import * as express from 'express';
import {
  Get,
  Post,
  Put,
  Delete
} from '../../../_core/_base/_controller/_decorators/route.decorator';
import { Controller } from '../../../_core/_base/_controller/_decorators/controller.decorator';
import { TestService } from '../services/test.service';

@Controller({ path: 'test' })
export class TestController extends BaseController {
  private service: TestService;
  constructor() {
    super();
    this.service = new TestService();
  }

  @Get({ path: 'test' })
  public async all(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const list: TestModel[] = await this.service.findAll();
      return response.status(200).send(list);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Get({ path: 'test/:id' })
  public async some(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const element: TestModel = await this.service.find(request.params.id);
      if (element) {
        return response.status(200).send(element);
      }
      return response.status(404).send();
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Post({ path: 'test' })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const saved: TestModel = await this.service.create(request.body);
      return response.status(201).send(saved);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Put({ path: 'test/:id' })
  public async test(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const saved: TestModel = await this.service.update(
        request.params.id,
        request.body
      );
      return response.status(200).send(saved);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Delete({ path: 'test/:id' })
  public async remove(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      const deleted: boolean = await this.service.remove(request.params.id);
      if (deleted) {
        return response.status(204).send();
      }
      return response.status(404).send();
    } catch (e) {
      return this.handleError(e, response);
    }
  }
}

export default TestController;
