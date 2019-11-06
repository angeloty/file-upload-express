import { Model } from '_core/_base/_data/model';
import { IModelData } from "./descriptors";
export interface IModelData {
  [key: string]: any;
}

export type DataType = String | Boolean | Number | any[] | Model | Model[] | Array<any> | File ;

export interface IModelFieldDescriptor {
  type: DataType;
  validator?: Function;
  regex?: RegExp;
  default?: any;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface IModelFields {
  [key: string]: IModelFieldDescriptor;
}

export interface IModelError {
  type: string;
  message: string;
}
