import { BaseUserModel } from './../../_auth/_models/user.model';
export const securityContext = {
  modelCls: BaseUserModel,
  setModelCls(model: new <T extends BaseUserModel>() => T) {
    this.modelCls = model;
  }
};

export default securityContext;
