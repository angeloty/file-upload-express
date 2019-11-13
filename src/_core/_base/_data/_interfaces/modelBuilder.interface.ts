import { Model } from '../model.container';
import { IModelData } from './descriptors.interface';

export interface IModelBuilder<T extends Model> {
  new (data?: IModelData): T;
  create(data?: IModelData): T;
}

export interface IRepositoryFilter {
  [key: string]: any;
}
