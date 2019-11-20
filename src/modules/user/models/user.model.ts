import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';
import { BaseUserModel } from '../../../_core/_auth/_models/user.model';

@Entity()
export class UserModel extends BaseUserModel {
}
