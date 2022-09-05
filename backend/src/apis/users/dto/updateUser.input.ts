import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  name?: string;

  @Field(() => String)
  nickname?: string;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  password?: string;

  @Field(() => String)
  phone?: string;

  @Field(() => Int)
  point?: number;

  @Field(() => String)
  storeName?: string;

  @Field(() => String)
  businessLicenseImg?: string;

  @Field(() => String)
  profileImgUrl?: string;
}
