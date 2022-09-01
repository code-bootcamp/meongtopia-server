import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
// import { ImageInput } from 'src/apis/images/dto/image.input';

@InputType()
export class CreateStoreInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Min(0)
  @Field(() => Int)
  entranceFee: number;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  runTime: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  menuImg: string;

  @Field(() => [String])
  pet: string[];

  @Field(() => [String])
  storeImage: string[];

  @Field(() => [String])
  storeTag: string[];

  @Field(() => [String])
  gameGenre: string[];
}
