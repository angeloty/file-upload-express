import { BaseUserService } from './../_services/user.service';
import * as express from 'express';
import route, {
  HTTP_METHODS
} from '../../_base/_controller/_decorators/route.decorator';
import { Repository, BaseEntity } from 'typeorm';
import { BaseUserModel } from '../_models/user.model';
import Controller from '../../_base/_controller/controller';

export class BaseUserController<
  T extends BaseUserModel,
  S extends BaseUserService<T>
> extends Controller {
  protected repository: Repository<T>;
  protected service: S;
  private modelClass: any;
  private serviceClass: any;
  constructor(
    connection: any,
    modelClass?: new () => T,
    serviceClass?: new () => S
  ) {
    super(connection);
    this.modelClass = modelClass ? modelClass : BaseUserModel;
    this.serviceClass = serviceClass ? serviceClass : BaseUserService;
    this.service = new this.serviceClass(connection, this.modelClass) as S;
  }

  @route({ path: '', method: HTTP_METHODS.GET })
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

  @route({ path: ':id', method: HTTP_METHODS.GET })
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

  @route({ path: '', method: HTTP_METHODS.POST })
  public async add(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): Promise<express.Response> {
    try {
      console.log(request.body);
      const saved: T = await this.service.register(request.body);
      return response.status(201).send(saved);
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @route({ path: 'signup', method: HTTP_METHODS.POST })
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

  @route({ path: 'signin', method: HTTP_METHODS.POST })
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
      return response.status(201).send({ user, token });
    } catch (e) {
      return this.handleError(e, response);
    }
  }

  @route({ path: 'signout', method: HTTP_METHODS.POST })
  public logout(
    request: express.Request,
    response: express.Response
  ): express.Response {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    return response.send(200);
  }

  @route({ path: ':id', method: HTTP_METHODS.PUT })
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

  @route({ path: ':id', method: HTTP_METHODS.DELETE })
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
