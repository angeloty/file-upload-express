import { appContent } from './../../../config/constants';
import { AdapterModelDefinition } from './../../_db/_adapters/adapterModelDef';
import { InvalidModelDataException } from '../../_exceptions/invalidData.exception';
import { Adapter } from '../../_db/adapter';
import {
  IModelFields,
  IModelData,
  IModelError,
  IModelFieldDescriptor
} from '../_interfaces/descriptors.interface';
import 'reflect-metadata';
import Registry from '../_providers/registry.provider';

// tslint:disable:variable-name
// tslint:disable:function-name
const columnMetaKey = Symbol('Column');
export type ModelConstructor = Model;
export abstract class Model implements IModelData {
  public static init<T extends Model>(
    this: new (d: IModelData) => T,
    data: IModelData
  ): T {
    const object = Object.assign(new this(data), {});
    Registry.addModelDef(
      this.constructor.name,
      appContent.db.adapter.buildModelDef(
        this.constructor.name,
        object.getFields()
      )
    );
    return object;
  }

  public static create<T>(this: new (d: IModelData) => T, data: IModelData): T {
    const object = Object.assign(new this(data), {});
    return object;
  }
  protected _$adapter: Adapter = appContent.db.adapter;
  protected _$data: IModelData = {};
  protected _$fields: IModelFields = {};
  protected _$errors: IModelError[] = [];
  protected _$adapterModelDefinition: AdapterModelDefinition;
  protected _$modelDefinition: any;

  private _$$props: string[] = [
    '_$adapter',
    '_$adapterModelDefinition',
    '_$modelDefinition',
    '_$adapter',
    '_$data',
    '_$fields',
    '_$errors',
    '_$$props',
    '_$build',
    '_$createProps',
    '_$validate',
    'set',
    'addField',
    'getFields',
    'setAdapterModelDefinition',
    'toObject',
    'toJSON',
    'find',
    'findBy',
    'save',
    'update',
    'remove'
  ];

  constructor(values?: IModelData) {
    this.set(values);
    this._$adapterModelDefinition = this._$adapter.getModelDefinition(
      this.constructor.name
    );
    this._$modelDefinition = this._$adapterModelDefinition.create();
  }

  public addField(name: string, definition: IModelFieldDescriptor) {
    if (!this._$fields) {
      this._$fields = {};
    }
    if (!this._$fields[name]) {
      this._$fields[name] = definition;
    }
  }

  public getFields(): IModelFields {
    return this._$fields;
  }

  public setAdapterModelDefinition(modelDef: AdapterModelDefinition): void {
    this._$adapterModelDefinition = modelDef;
  }

  public toObject(): { [key: string]: any } {
    const object: { [key: string]: any } = {};
    const keys = Object.keys(this._$fields);
    for (let key of keys) {
      if (this._$data[key]) {
        if (this._$data[key] instanceof Model) {
          object[key] = this._$data[key].toObject();
        } else {
          object[key] = this._$data[key];
        }
      }
    }
    return object;
  }

  public toJSON(): { [key: string]: any } {
    const object = this.toObject();
    return object;
  }

  public async find(id: any): Promise<Model> {
    try {
      const result = await this._$adapter.findById(id);
      this.set(result);
      return this;
    } catch (e) {
      throw e;
    }
  }

  public async save(): Promise<Model> {
    try {
      const result = await this._$adapter.save(this);
      this.set(result);
      return this;
    } catch (e) {
      throw e;
    }
  }

  public async update(): Promise<Model> {
    try {
      const result = await this._$adapter.update(this);
      this.set(result);
      return this;
    } catch (e) {
      throw e;
    }
  }

  public async remove(): Promise<Model> {
    try {
      const result = await this._$adapter.remove(this);
      this.set(result);
      return this;
    } catch (e) {
      throw e;
    }
  }

  protected set(values: IModelData): Model {
    const keys: string[] = Object.keys(values);
    for (let key of keys) {
      if (!this._$$props.some((k: string) => k === key)) {
        if (this._$fields[key]) {
          Object.assign(this, { [key]: values[key] });
        }
      }
    }
    return this;
  }

  private _$validate(field: string, value: any): boolean {
    return true;
  }
}

export default Model;
