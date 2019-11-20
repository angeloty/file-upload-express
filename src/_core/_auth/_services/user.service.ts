import { UserProvider } from './../../_base/_security/_providers/user.provider';
import { Connection, Repository } from 'typeorm';
import { Service } from './../../_base/_service/service';
import { BaseUserModel } from '../_models/user.model';
import UserNotFoundException from '../../_base/_security/_exceptions/userNotFound.exception';
import TokenData from '../../_base/_security/_interfaces/tokenData.interface';
import applicationContext from '../../application.context';
export class BaseUserService<T extends BaseUserModel> extends Service<T> {
  protected repository: Repository<T>;
  private modelClass: any;

  constructor(modelClass?: new () => T) {
    super(applicationContext.connection);
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
      return await UserProvider.create(this.connection, this.modelClass, user);
    } catch (e) {
      throw e;
    }
  }

  public update = async (
    id: string,
    body: { [P in keyof T]: any }
  ): Promise<T> => {
    try {
      return await UserProvider.update(this.connection, this.modelClass, id, body);
    } catch (e) {
      throw e;
    }
  }

  public login = async (
    username: string,
    pass: string
  ): Promise<{ user: T; token: string; cookie: string }> => {
    try {
      return await UserProvider.login<T>(this.connection, this.modelClass, username, pass);
    } catch (e) {
      throw e;
    }
  }

  public createToken(user: T): TokenData {
    return UserProvider.createToken<T>(user);
  }

  public createCookie(tokenData: TokenData): string {
    return UserProvider.createCookie(tokenData);
  }

  public remove = async (id: string): Promise<boolean> => {
    try {
      return await UserProvider.remove(this.connection, this.modelClass, id);
    } catch (e) {
      throw e;
    }
  }
}
