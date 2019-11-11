import { Model } from '_core/_base/_data/model';
import { IModelData } from './descriptors';
export interface IModelData {
  [key: string]: any;
}

export type DataType =
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | any[]
  | Model
  | Model[]
  | ArrayConstructor
  | ObjectConstructor
  | File;

export interface IModelFieldDescriptor {
  type: DataType;
  validator?: IValidator;
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

export interface IValidator {
  regexp?: RegExp;
  validationFn?: Function;
}
