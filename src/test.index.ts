import appEnvironment from './app';
import App from './_core/_base/app';

process.env.NODE_ENV = 'test';
const environment = appEnvironment;
const testAppContainer: Promise<App> = environment.init();
export default testAppContainer;
