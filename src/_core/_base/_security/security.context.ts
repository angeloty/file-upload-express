import { BaseUserModel } from './../../_auth/_models/user.model';
export const securityContext = {
  userModel: BaseUserModel,
  set(conf: {userModel: BaseUserModel}) {
    this.userModel = conf.userModel;
  }
};

export default securityContext;
