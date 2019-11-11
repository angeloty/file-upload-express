import { TestModel } from './models/test.model';
import { TestController } from './controllers/test.controller';
import { Module } from './../../_core/_base/module';
export class TestModule extends Module {
  constructor(connection?: any) {
    super([new TestController(connection)], [TestModel]);
  }
}
