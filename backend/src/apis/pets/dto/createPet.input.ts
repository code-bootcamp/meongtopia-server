import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
// import { ImageInput } from 'src/apis/images/dto/image.input';

@InputType()
export class CreatePetInput {
  @Field(() => String)
  petImgUrl: string;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  age: number;

  @Field(() => String)
  breed: string;

  @Field(() => String)
  description: string;
}
