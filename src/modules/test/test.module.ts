import { TestController } from './controllers/test.controller';
import { Module } from './../../_core/_base/module';
export class TestModule extends Module {
  constructor() {
    super([new TestController()]);
  }
}
