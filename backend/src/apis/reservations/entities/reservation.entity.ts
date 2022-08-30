import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Reservation {
  @PrimaryColumn('uuid')
  @Field(() => String)
  resID: string;
}
