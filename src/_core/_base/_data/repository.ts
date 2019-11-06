import { Model } from './model';
import { Adapter } from '../../_db/adapter';
import { IModelBuilder, IRepositoryFilter } from './_interfaces/modelBuilder';

export abstract class Repository<T extends Model> {
  protected adapter: Adapter;
  protected modelBuilder: IModelBuilder<T>;

  constructor(builder: IModelBuilder<T>) {
    this.modelBuilder = builder;
  }

  public async findById(id: any): Promise<T> {
    try {
      const model = this.modelBuilder.create();
      const result: T = await (model.find(id) as Promise<T>);
      return result;
    } catch (e) {}
  }

  public async findBy(filter: IRepositoryFilter): Promise<T[]> {
    try {
      const queryRes = await this.adapter.findBy(filter);
      let result: T[] = [];
      for (let res of queryRes) {
        const model = this.modelBuilder.create(res);
        result = [...result, model];
      }
      return result;
    } catch (e) {}
  }

  public async save(model: T): Promise<T> {
    try {
      const result: T = await (model.save() as Promise<T>);
      return result;
    } catch (e) {}
  }

  public async update(model: T): Promise<T> {
    try {
      const result: T = await (model.update() as Promise<T>);
      return result;
    } catch (e) {}
  }

  public async remove(model: T): Promise<T> {
    try {
      const result: T = await (model.remove() as Promise<T>);
      return result;
    } catch (e) {}
  }
}

export default Repository;
