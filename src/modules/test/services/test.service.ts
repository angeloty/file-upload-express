import applicationContext from '../../../_core/application.context';
import { TestModel } from '../models/test.model';
import { DeepPartial } from 'typeorm';
import PostNotFoundException from '../../../_core/_exceptions/PostNotFoundException';

export class TestService {
  private repository;
  constructor() {
    this.repository = applicationContext.connection.getRepository<TestModel>(
      TestModel
    );
  }

  public find = async (id: string): Promise<TestModel> => {
    try {
      const element: TestModel = await this.repository.findOne(id);
      if (element) {
        return element;
      }
      throw new PostNotFoundException(id);
    } catch (e) {
      throw e;
    }
  }

  public findAll = async (): Promise<TestModel[]> => {
    try {
      return await this.repository.find({});
    } catch (e) {
      throw e;
    }
  }

  public create = async (test: DeepPartial<TestModel>): Promise<TestModel> => {
    try {
      return await this.repository.save(
        this.repository.merge(new TestModel(), test)
      );
    } catch (e) {
      throw e;
    }
  }

  public update = async (
    id: string,
    test: DeepPartial<TestModel>
  ): Promise<TestModel> => {
    try {
      const toUpdate = await this.find(id);
      return await this.repository.save(this.repository.merge(toUpdate, test));
    } catch (e) {
      throw e;
    }
  }

  public remove = async (id: string): Promise<boolean> => {
    try {
      const toUpdate = await this.find(id);
      return !!(await this.repository.delete(id));
    } catch (e) {
      throw e;
    }
  }
}
