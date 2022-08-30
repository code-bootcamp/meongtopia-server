import { Field, ObjectType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
import { User } from 'src/apis/users/entities/user.entity';
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
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  reviewID: string;

  @Column()
  @Field(() => String)
  content: string;

  rating: number;
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Store)
  @Field(() => [Store])
  store: Store[];

  @ManyToOne(() => User)
  @Field(() => [User])
  user: User[];
}
