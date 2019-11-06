import { IModelFields } from './../../../_base/_data/_interfaces/descriptors';
import { MongooseModelDefinition } from './../mongoose/model/mongooseModelDef';
import { AdapterModelDefinition } from '../adapterModelDef';
import Adapter from '../../adapter';
import * as mongoose from 'mongoose';

export class Mongoose extends Adapter {
  public initialize(): Mongoose {
    return this;
  }
  public async connect(): Promise<Mongoose> {
    const { DB_USER, DB_PASSWORD, DB_PATH } = process.env;
    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}${DB_PATH}`);
    return this;
  }

  public build(): Promise<Adapter> {
    return null;
  }

  public buildModelDef(model: IModelFields): AdapterModelDefinition {
    return new MongooseModelDefinition(model);
  }

  public async findById(id: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  public async findBy(filter: any): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  public async save(model: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  public async update(model: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  public remove(model: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
