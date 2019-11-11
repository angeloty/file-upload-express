import { Model } from '_core/_base/_data/model';
import {
  DataType,
  IValidator,
  IModelFieldDescriptor
} from './../_interfaces/descriptors';
import 'reflect-metadata';

const metadataKey = Symbol('Column');

// tslint:disable-next-line:function-name
function Column(
  name: string,
  descriptor: IModelFieldDescriptor
): (target: Model, propertyKey: string) => void {
  return function registerProperty(target: Model, propertyKey: string): void {
    let properties: string[] = Reflect.getMetadata(metadataKey, target);
    target.addField(name, descriptor);
    if (properties) {
      properties.push(propertyKey);
    } else {
      properties = [propertyKey];
    }
    Reflect.defineMetadata(metadataKey, properties, target);
  };
}

export default Column;
