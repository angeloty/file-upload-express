import Repository from '_core/_base/_data/repository';
import { TestModel } from '../models/test.model';

export class TestRepository extends Repository<TestModel> {
  constructor() {
    super(TestModel);
  }
}
