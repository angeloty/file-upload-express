import Adapter from './adapter';
import { Mongoose } from './_adapters/mongoose/mongoose';

export class DB {
  private adapter: Adapter;
  public initializeAdapter(): Adapter {
    const adapter: string = process.env.PORT ? process.env.PORT : 'mongoose';
    switch (adapter) {
      case 'mongoose':
        this.adapter = new Mongoose();
        break;
      default:
        this.adapter = new Mongoose();
        break;
    }
    return this.adapter;
  }
  public async connect() {
    this.initializeAdapter();
    return await this.adapter.connect();
  }
}
