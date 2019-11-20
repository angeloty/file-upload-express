import { TestModel } from './models/test.model';
import { TestController } from './controllers/test.controller';
import { Module } from './../../_core/_base/module';
import UploaderController from './controllers/uploader.controller';
export class TestModule extends Module {
  constructor() {
    super({
      controllers: [TestController, UploaderController],
      models: [TestModel]
    });
  }
}

export default TestModule;
