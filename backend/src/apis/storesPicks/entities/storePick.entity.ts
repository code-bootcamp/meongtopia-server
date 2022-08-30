import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';

import {
  Column,
  Entity,
  // ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
@ObjectType()
export class Pick {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  pickID: string;

  @Column({ default: false })
  @Field(() => Boolean)
  state: boolean;

  @ManyToOne(() => User)
  @Field(() => [User])
  users: User[];
}
