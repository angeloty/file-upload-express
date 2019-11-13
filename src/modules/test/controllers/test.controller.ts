import { Repository, DeleteResult } from 'typeorm';
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
  public async all(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<TestModel>(TestModel);
      const list: TestModel[] = await this.repository.find();
      return response.status(200).send(list);
    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: 'test/:id', method: HTTP_METHODS.GET })
  public async some(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<TestModel>(TestModel);
      const element: TestModel = await this.repository.findOne(request.params.id);
      if (element) {
        return response.status(200).send(element);
      }
      return response.status(404).send();
    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: 'test', method: HTTP_METHODS.POST })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<TestModel>(TestModel);
      const element = new TestModel();
      element.name = request.body.name;
      element.description = request.body.description;
      const saved: TestModel = await this.repository.save(element);
      return response.status(201).send(saved);
    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: 'test/:id', method: HTTP_METHODS.PUT })
  public async test(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<TestModel>(TestModel);
      const element: TestModel = await this.repository.findOne(request.params.id);
      if (element) {
        element.name = request.body.name;
        element.description = request.body.description;
        const saved: TestModel = await this.repository.save(element);
        return response.status(200).send(saved);
      }
      return response.status(404).send();

    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: 'test/:id', method: HTTP_METHODS.DELETE })
  public async remove(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<TestModel>(TestModel);
      const element: TestModel = await this.repository.findOne(request.params.id);
      if (element) {
        const deleted: DeleteResult = await this.repository.delete(element);
        return response.status(204).send();
      }
      return response.status(404).send();

    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }
}
