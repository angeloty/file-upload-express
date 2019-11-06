import { cleanEnv, port, str } from 'envalid';

function configEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    DB_ADAPTER: str(),
    DB_PASSWORD: str(),
    DB_PATH: str(),
    DB_USER: str(),
    PORT: port()
  });
}

export default configEnv;
