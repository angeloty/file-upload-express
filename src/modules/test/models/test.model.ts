import { IModelData } from './../../../_core/_base/_data/_interfaces/descriptors';
import { Model } from '_core/_base/_data/model';
export class TestModel extends Model {
  constructor(value?: IModelData) {
    super({}, value);
  }
}
