import { IModelFields } from './../_base/_data/_interfaces/descriptors';
import { AdapterModelDefinition } from './_adapters/adapterModelDef';
export abstract class Adapter {
  public abstract initialize(): Adapter;
  public abstract async connect(): Promise<Adapter>;
  public abstract buildModelDef(model: IModelFields): AdapterModelDefinition;
  public abstract async build(): Promise<Adapter>;
  public abstract async findById(id: any): Promise<any>;
  public abstract async findBy(filter: any): Promise<any[]>;
  public abstract async save(model: any): Promise<any>;
  public abstract async update(model: any): Promise<any>;
  public abstract async remove(model: any): Promise<any>;
}

export default Adapter;
