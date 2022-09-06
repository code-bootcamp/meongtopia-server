import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payments/entities/payment.entity';
import { Store } from 'src/apis/stores/entities/store.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryColumn('uuid')
  @Field(() => String)
  resID: string;

  @Column({ nullable: true })
  @Field(() => String)
  start?: string;

  @Column({ nullable: true })
  @Field(() => String)
  end?: string;

  @Column({ nullable: true })
  @Field(() => Int)
  members: number;

  @Column({ nullable: true })
  @Field(() => Int)
  dogamount: number;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  @ManyToOne(() => Store)
  @Field(() => Store)
  store: Store;
}
