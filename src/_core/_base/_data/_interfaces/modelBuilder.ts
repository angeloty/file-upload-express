import { Model } from "../model";
import { IModelData } from "./descriptors";

export interface IModelBuilder<T extends Model> {
  new (data?: IModelData): T;
  create(data?: IModelData): T;
}

export interface IRepositoryFilter {
  [key: string]: any;
}
