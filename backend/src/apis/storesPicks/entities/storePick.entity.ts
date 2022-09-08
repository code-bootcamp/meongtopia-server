import { Field, ObjectType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
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

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Store, { nullable: true })
  @Field(() => Store, { nullable: true })
  store: Store;
}
