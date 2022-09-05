import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Payment } from 'src/apis/payments/entities/payment.entity';
import { Store } from 'src/apis/stores/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Income {
  @PrimaryColumn()
  @Field()
  incomeID: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Store)
  @Field(() => Store)
  store: Store;

  @JoinColumn()
  @OneToOne(() => Payment)
  @Field(() => Payment)
  payment: Payment;
}
