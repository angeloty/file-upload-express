import {
  DeleteResult,
  Repository,
  Connection,
  DeepPartial
} from 'typeorm';
import { BaseUserModel } from '../../../_auth/_models/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import TokenData from '../_interfaces/tokenData.interface';
import DataStoredInToken from '../_interfaces/dataStoredInToken.interface';
import WrongCredentialsException from '../_exceptions/wrongCredentials.exception';
import UserNotFoundException from '../_exceptions/userNotFound.exception';
import InvalidUserDataException from '../_exceptions/invalidUserData.exception';
import HttpException from '../../../_exceptions/HttpException';
import { ROLE } from '../_interfaces/roles.enum';

export class UserProvider {
  public static async find<U extends BaseUserModel>(
    connection: Connection,
    modelClass: new () => U,
    id: string
  ): Promise<U> {
    try {
      const repository = connection.getRepository(modelClass);
      const element: U = await repository.findOne(id);
      if (element) {
        return element;
      }
      throw new UserNotFoundException();
    } catch (e) {
      throw e;
    }
  }
  public static async create<U extends BaseUserModel>(
    connection: Connection,
    modelClass: new () => U,
    user: any
  ): Promise<U> {
    try {
      const repository: Repository<U> = connection.getRepository<U>(modelClass);
      const element: U = repository.merge(new modelClass() as U, user);
      element.password = await bcrypt.hash(user.password, 10);
      element.active = true;
      element.roles = [ROLE.USER];
      const saved: U = await repository.save(element as any);
      return saved;
    } catch (e) {
      if (e.code === 11000) {
        throw new InvalidUserDataException();
      }
      throw e;
    }
  }

  public static async update<U extends BaseUserModel>(
    connection: Connection,
    modelClass: new () => U,
    id: string,
    data: { [key: string]: any }
  ): Promise<U> {
    try {
      const repository = connection.getRepository(modelClass);
      const element: U = await UserProvider.find<U>(connection, modelClass, id);
      if (element) {
        element.username = data.username ? data.username : element.username;
        element.email = data.email ? data.email : element.email;
        return await repository.save(element as unknown as DeepPartial<U>);
      }
      throw new UserNotFoundException();
    } catch (e) {
      if (e.code === 11000) {
        throw new InvalidUserDataException();
      }
      throw new InvalidUserDataException();
    }
  }

  public static async remove<U extends BaseUserModel>(
    connection: Connection,
    modelClass: new () => U,
    id: string
  ) {
    try {
      const repository = connection.getRepository(modelClass);
      const element = await UserProvider.find<U>(connection, modelClass, id);
      const deleted: DeleteResult = await repository.delete(id);
      console.log(deleted);
      if (deleted) {
        return true;
      }
      throw new HttpException(500, 'Operation Fail!!!');
    } catch (e) {
      throw e;
    }
  }

  public static async login<U extends BaseUserModel>(
    connection: Connection,
    modelClass: new () => U,
    username: string,
    password: string
  ): Promise<{ user: U; token: string; cookie: string }> {
    try {
      const repository = connection.getRepository(modelClass);
      const result: U[] = await repository.find({
        where: {
          username
        }
      });
      if (result.length) {
        const user = result[0];
        const passwordMatching = await bcrypt.compare(password, user.password);
        if (passwordMatching) {
          const jwToken = UserProvider.createToken<U>(user);
          const token = jwToken.token;
          const cookie = UserProvider.createCookie(jwToken);
          return { user, token, cookie };
        }
      }
      throw new WrongCredentialsException();
    } catch (e) {
      throw e;
    }
  }

  public static createToken<U extends BaseUserModel>(user: U): TokenData {
    const expiresIn = parseFloat(process.env.JWT_EXPIRES);
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user.id.toString()
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  public static createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}
