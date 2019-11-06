import {
  IModelData,
  IModelFields
} from "./../../_base/_data/_interfaces/descriptors";
import { Model } from "_core/_base/_data/model";

class User extends Model {
  _$fields: IModelFields = {
    username: {
      type: "text",
      required: true,
      minLength: 3,
      maxLength: 25
    },
    email: {
      type: "email",
      required: true,
      minLength: 5,
      maxLength: 100
    },
    password: {
      type: "password",
      required: true
    }
  };
  constructor(values?: IModelData) {
    super(values);
  }
}

export default Model;
