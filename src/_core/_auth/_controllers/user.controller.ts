import { BaseUserService } from './../_services/user.service';
import * as express from 'express';
import {
  Get,
  Post,
  Put,
  Delete
} from '../../_base/_controller/_decorators/route.decorator';
import { Repository, BaseEntity } from 'typeorm';
import { BaseUserModel } from '../_models/user.model';
import BaseController from '../../_base/_controller/controller';

export class BaseUserController<
  T extends BaseUserModel,
  S extends BaseUserService<T>
> extends BaseController {
  protected repository: Repository<T>;
  protected service: S;
  private modelClass: any;
  private serviceClass: any;
  constructor(
    modelClass?: new () => T,
    serviceClass?: new () => S
  ) {
    super();
    this.modelClass = modelClass ? modelClass : BaseUserModel;
    this.serviceClass = serviceClass ? serviceClass : BaseUserService;
    this.service = new this.serviceClass(this.modelClass) as S;
  }

  @Get({ path: '' })
  public async all(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const list: T[] = await this.service.getAll();
      return response.status(200).send(list);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Get({ path: ':id', secured: true })
  public async some(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const element: T = await this.service.findById(request.params.id);
      return response.status(200).send(element);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Post({ path: '' })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const saved: T = await this.service.register(request.body);
      return response.status(201).send(saved);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Post({ path: 'signup' })
  public async register(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const saved: T = await this.service.register(request.body);
      return response.status(201).send(saved);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Post({ path: 'signin' })
  public async login(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const { user, token, cookie } = await this.service.login(
        request.body.username,
        request.body.password
      );
      response.setHeader('Set-Cookie', [cookie]);
      return response.status(200).send({ user, token });
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Post({ path: 'signout' })
  public logout(
    request: express.Request,
    response: express.Response
  ): express.Response {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    return response.send(200);
  }

  @Put({ path: ':id', secured: true })
  public async update(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const element: any = await this.service.update(
        request.params.id,
        request.body
      );
      return response.status(200).send(element);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @Delete({ path: ':id', secured: true })
  public async remove(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      const element: boolean = await this.service.remove(request.params.id);
      if (element) {
        return response.status(204).send();
      }
      return response.status(404).send();
    } catch (e) {
      return this.handleError(e, response);
    }
  }
}
