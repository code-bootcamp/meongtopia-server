import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  storeName?: string;

  @Field(() => String, { nullable: true })
  businessLicenseImg?: string;
}
