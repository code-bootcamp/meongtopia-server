import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviewes/entities/review.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ReviewImg {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  imgID: string;

  @Column()
  @Field(() => String)
  url: string;

  @ManyToOne(() => Review)
  @Field(() => [Review])
  review: Review[];
}
