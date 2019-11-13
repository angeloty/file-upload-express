import * as express from 'express';
import { HTTP_METHODS } from '../../_base/_controller/_decorators/route.decorator';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { BaseUserModel } from '../_models/user.model';
import Controller from '../../_base/_controller/controller';
import route from '../../_base/_controller/_decorators/route.decorator';

export class BaseUserController<T extends BaseUserModel> extends Controller {
  protected repository: Repository<T>;
  private modelClass: any;
  constructor(connection: any, modelClass?: new () => T) {
    super(connection);
    this.modelClass = modelClass ? modelClass : BaseUserModel;
  }

  @route({ path: '', method: HTTP_METHODS.GET })
  public async all(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<T>(this.modelClass);
      const list: T[] = await this.repository.find();
      return response.status(200).send(list);
    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: ':id', method: HTTP_METHODS.GET })
  public async some(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<T>(this.modelClass);
      const element: T = await this.repository.findOne(request.params.id);
      if (element) {
        return response.status(200).send(element);
      }
      return response.status(404).send();
    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: '', method: HTTP_METHODS.POST })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<T>(this.modelClass);
      const element = new this.modelClass();
      element.username = request.body.username;
      element.email = request.body.email;
      element.password = request.body.password;
      element.active = true;
      const saved: T = await this.repository.save(element);
      return response.status(201).send(saved);
    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: ':id', method: HTTP_METHODS.PUT })
  public async update(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<T>(this.modelClass);
      const element: any = await this.repository.findOne(request.params.id);
      if (element) {
        element.username = request.body.username;
        element.email = request.body.email;
        const updated: UpdateResult = await this.repository.update(element.id, element);
        if (updated.affected) {
          return response.status(200).send(element);
        }

      }
      return response.status(404).send();

    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }

  @route({ path: ':id', method: HTTP_METHODS.DELETE })
  public async remove(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    try {
      this.repository = await this.getRepository<T>(this.modelClass);
      const element: T = await this.repository.findOne(request.params.id);
      if (element) {
        const deleted: DeleteResult = await this.repository.delete(element.id);
        if (deleted.affected) {
          return response.status(204).send();
        }
      }
      return response.status(404).send();

    } catch (e) {
      return response.status(500).send({ error: e.message });
    }
  }
}
