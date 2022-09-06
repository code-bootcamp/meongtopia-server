import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  card_number: string;

  @Field(() => String)
  cvc: string;

  @Field(() => String)
  zip_code: string;

  @Field(() => String)
  userId: string;
}
