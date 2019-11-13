import { Column, ObjectIdColumn, ObjectID, BaseEntity, Index } from 'typeorm';

export abstract class BaseUserModel extends BaseEntity {
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
}
