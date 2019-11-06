import { IModelFields } from './../../../_base/_data/_interfaces/descriptors';
import { MongoseModelDefinition } from './../mongoose/model/mongooseModelDef';
import { Model } from '_core/_base/_data/model';
import { AdapterModelDefinition } from '../adapterModelDef';
import Adapter from "../../adapter";
import * as mongoose from "_core/_db/_adapters/mongoose/mongoose";

export class Mongoose extends Adapter {
  public initialize(): Mongoose {
    return this;
  }
  public async connect(): Promise<Mongoose> {
    const { DB_USER, DB_PASSWORD, DB_PATH } = process.env;
    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}${DB_PATH}`);
    return this;
  }

  build(): Promise<Adapter>  {
    
  }

  buildModelDef(model: IModelFields): AdapterModelDefinition {
    return new MongoseModelDefinition(model);
  }

  public async findById(id: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async findBy(filter: any): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  public async save(model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async update(model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public remove(model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
