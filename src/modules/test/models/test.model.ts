import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class TestModel extends BaseEntity {
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public name: string;

  @Column()
  public description: string;
}
