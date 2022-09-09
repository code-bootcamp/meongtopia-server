import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Store } from 'src/apis/stores/entities/store.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryColumn('uuid')
  @Field(() => String)
  resID: string;

  @Column({ nullable: true })
  @Field(() => Int)
  members: number;

  @Column({ nullable: true })
  @Field(() => Int)
  amount: number;

  @JoinColumn()
  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Store)
  @Field(() => Store)
  store: Store;
}
