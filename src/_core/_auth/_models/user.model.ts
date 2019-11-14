import {
  Column,
  ObjectIdColumn,
  ObjectID,
  BaseEntity,
  Index,
} from 'typeorm';
import { ROLE } from '../../_base/_security/_interfaces/roles.enum';

export class BaseUserModel extends BaseEntity {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  @Index({ unique: true })
  public username: string;

  @Column()
  @Index({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public active: boolean;

  @Column()
  public roles: ROLE[];
}
