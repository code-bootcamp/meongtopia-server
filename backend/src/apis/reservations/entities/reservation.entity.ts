import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Income } from 'src/apis/incomes/entities/incomes.entity';
import { Store } from 'src/apis/stores/entities/store.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  resID: string;

  @Column({ nullable: true })
  @Field(() => Int)
  members: number;

  @Column({ nullable: true })
  @Field(() => Int)
  amount: number;

  @Column({ nullable: true })
  @Field(() => String)
  date: string;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @ManyToOne(() => Store)
  @Field(() => Store)
  store: Store;

  @JoinColumn()
  @ManyToOne(() => Income)
  @Field(() => Income)
  income: Income;
}
