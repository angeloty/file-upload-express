import appEnvironment from './app';

process.env.NODE_ENV = 'development';
const environment = appEnvironment;
environment.run();
