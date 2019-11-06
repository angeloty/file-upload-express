import {
  IModelFields,
  DataType
} from './../../../../_base/_data/_interfaces/descriptors';
import * as mongoose from 'mongoose';
import { AdapterModelDefinition } from '../../adapterModelDef';
interface IMongooseModelField {
  [key: string]: IMongooseFieldConfig;
}
interface IMongooseFieldConfig {
  type: DataType;
  required?: boolean;
}
export class MongooseModelDefinition extends AdapterModelDefinition {
  constructor(model: IModelFields) {
    super();
    this.modelDef = mongoose.model(
      model.constructor.name + 'Mongose',
      new mongoose.Schema(this.buildModelConfig(model))
    );
  }
  private buildModelConfig(fields: IModelFields): IMongooseModelField {
    const keys = Object.keys(fields);
    const config: IMongooseModelField = {};
    for (let key of keys) {
      config[key].type = fields[key].type;
      config[key].required = fields[key].required;
    }
    return config;
  }
}
