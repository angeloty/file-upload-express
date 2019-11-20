import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';

export function configEnv(): void {
  console.log(`Environment is '${process.env.NODE_ENV}'`);
  switch (process.env.NODE_ENV) {
    case 'development':
      configDotenv({
        path: resolve(__dirname, '../../.env.development')
      });
      break;
    case 'test':
      configDotenv({
        path: resolve(__dirname, '../../.env.test')
      });
      break;
    // Add 'staging' and 'production' cases here as well!
    default:
      configDotenv({
        path: resolve(__dirname, '../../.env')
      });
  }
}

export default configEnv;
