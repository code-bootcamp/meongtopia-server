import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class createReviewInput {
  @Field(() => Float)
  rating: number;

  @Field(() => String)
  contents: string;
}
