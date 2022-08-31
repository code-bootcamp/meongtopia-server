import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryColumn('uuid')
  @Field(() => String)
  resID: string;

  @JoinColumn()
  @OneToOne(() => User)
  @Field(() => User)
  user: User;
}
