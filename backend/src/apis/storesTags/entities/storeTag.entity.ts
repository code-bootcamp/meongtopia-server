import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

//enum
export enum TAG_ENUM {
  TOGETHER = 'TOGETHER',
  BACKYARD = 'BACKYARD',
  BIGDOG = 'BIGDOG',
  NAN = 'NAN',
}
//enum type 등록
registerEnumType(TAG_ENUM, {
  name: 'TAG_ENUM',
});

@Entity()
@ObjectType()
export class StoreTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  tagID: string;

  @Column({ type: 'enum', enum: TAG_ENUM })
  @Field(() => TAG_ENUM)
  name: string;

  @ManyToMany(() => Store, (store) => store.storeTag)
  @Field(() => [Store])
  store: Store[];
}
