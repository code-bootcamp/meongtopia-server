import { Field, ObjectType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
@ObjectType()
export class StoreTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  tagID: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToMany(() => Store, (store) => store.storeTag)
  @Field(() => [Store])
  store: Store[];
}
