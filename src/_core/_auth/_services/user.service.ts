import { Connection, Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Service } from './../../_base/_service/service';
import { BaseUserModel } from '../_models/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import TokenData from '../_interfaces/tokenData.interface';
import DataStoredInToken from '../_interfaces/dataStoredInToken.interface';
import WrongCredentialsException from '../_exceptions/wrongCredentials.exception';
import UserNotFoundException from '../_exceptions/userNotFound.exception';
import HttpException from '../../_exceptions/HttpException';
export class BaseUserService<T extends BaseUserModel> extends Service<T> {
  protected repository: Repository<T>;
  private modelClass: any;

  constructor(conn: Connection, modelClass?: new () => T) {
    super(conn);
    this.modelClass = modelClass ? modelClass : BaseUserModel;
  }

  public getAll = async () => {
    try {
      return await this.getRepository(this.modelClass).find({});
    } catch (e) {
      throw e;
    }
  }

  public findById = async (id: string) => {
    try {
      const user = await this.getRepository(this.modelClass).findOne(id);
      if (!user) {
        throw new UserNotFoundException();
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  public register = async (user: any): Promise<T> => {
    try {
      const element: T = this.getRepository(this.modelClass).merge(new this.modelClass() as T, user);
      element.password = await bcrypt.hash(user.password, 10);
      element.active = true;
      const saved: T = await this.repository.save(element as any);
      return saved;
    } catch (e) {
      throw e;
    }
  }

  public update = async (id: string, body: {[P in keyof T]: any}): Promise<T> => {
    const element: T = await this.getRepository(this.modelClass).findOne(id);
    if (element) {
      const user: T = this.repository.merge(element, body);
      const updated: UpdateResult = await this.repository.update(element.id, user as any);
      if (updated.affected) {
        return await this.repository.findOne(id);
      }
      throw new HttpException(405, 'Invalid User data');
    }
    throw new UserNotFoundException();
  }

  public login = async (username: string, pass: string): Promise<{user: T, token: string}> => {
    try {
      const password = await bcrypt.hash(pass, 10);
      const result: T[] = await this.getRepository(this.modelClass).find({
        where: {
          username,
          password
        }
      });
      if (result.length) {
        const user = result[0];
        const token = this.createToken(user).token;
        return { user, token };
      }
      throw new WrongCredentialsException();
    } catch (e) {
      throw e;
    }
  }

  public createToken(user: T): TokenData {
    const expiresIn = parseFloat(process.env.JWT_EXPIRES);
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user.id.toString(),
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public remove = async (id: string): Promise<boolean> => {
    try {
      const element = await this.getRepository(this.modelClass).findOne(id);
      if (!element) {
        throw new UserNotFoundException();
      }
      const deleted: DeleteResult = await this.repository.delete(element.id);
      if (deleted.affected) {
        return true;
      }
      throw new HttpException(500, 'Operation Fail!!!');
    } catch (e) {
      throw e;
    }
  }

}
