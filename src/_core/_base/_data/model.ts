import { AdapterModelDefinition } from './../../_db/_adapters/adapterModelDef';
import { InvalidModelDataException } from "./../_exceptions/invalidDataException";
import { Adapter } from "../../_db/adapter";
import {
  IModelFields,
  IModelData,
  IModelError
} from "./_interfaces/descriptors";

export abstract class Model implements IModelData {
  protected _$adapter: Adapter = process.dbAdapter;
  protected _$data: IModelData = {};
  protected _$fields: IModelFields = {};
  protected _$errors: IModelError[] = [];
  protected _$adapterModelDefinition:AdapterModelDefinition;
  private _$$props: string[] = [
    "_$adapter",
    "_$data",
    "_$fields",
    "_$errors",
    "_$$props",
    "_$build",
    "_$createProps",
    "_$validate",
    "set",
    "find",
    "findBy",
    "save",
    "update",
    "remove"
  ];

  constructor(values?: IModelData) {
    this._$build();
    this.set(values);    
  }

  static create<T>(this: new (d: IModelData) => T, data: IModelData): T {
    const object = Object.assign(new this(data), {});
    return object;
  }

  private _$build(): void {
    if (this._$fields) {
      for (let field in this._$fields) {
        this._$createProps(field);
      }
    }
    this._$adapterModelDefinition = this._$adapter.buildModelDef(this._$fields);
  }

  private _$createProps(key: string): void {
    Object.defineProperty(this, key, {
      get: () => {
        return this._$data[key];
      },
      set: (value: any) => {
        if (this._$data[key] !== value) {
          try {
            this._$validate(key, value);
            this._$data[key] = value;
          } catch (e) {
            throw new InvalidModelDataException(key, e.message);
          }
        }
      }
    });
  }

  private _$validate(field: string, value: any): boolean {
    return true;
  }

  protected set(values: IModelData): Model {
    const keys: string[] = Object.keys(values);
    for (let key of keys) {
      if (!this._$$props.some((k: string) => k == key)) {
        if (this._$fields[key]) {
          Object.assign(this, { [key]: values[key] });
        }
      }
    }
    return this;
  }

  public toObject() {
    let object: { [key: string]: any } = {};
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
  }

  public toJSON() {
    let object = this.toObject();
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
}

export default Model;
