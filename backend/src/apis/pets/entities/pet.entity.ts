import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  petID: string;

  @Column()
  @Field(() => String)
  petImgUrl: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Int)
  age: number;

  @Column()
  @Field(() => String)
  breed: string;

  @Column()
  @Field(() => String)
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Store)
  @Field(() => Store)
  store: Store;
}
