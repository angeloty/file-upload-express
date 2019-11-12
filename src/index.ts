import 'reflect-metadata';
import configEnv from './config/config';
import App from './_core/_base/app';
import { TestModule } from './modules/test/test.module';

configEnv();

let app: App = new App();
try {
  app.initializeModules([new TestModule()]).then((application: App) => {
    app = application;
    app.listen();
  });
} catch (error) {
  console.log(error);
}
