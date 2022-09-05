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

  @Column()
  @Field(() => Int)
  members: number;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;

  @ManyToOne(() => Store)
  @Field(() => Store)
  reservation: Store;
}
