import { Field, ObjectType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class StoreImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  storeImgID: string;

  @Column()
  @Field(() => String)
  url: string;

  @ManyToOne(() => Store)
  @Field(() => [Store])
  store: Store[];
}
