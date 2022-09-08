import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { CreatePetInput } from 'src/apis/pets/dto/createPet.input';

@InputType()
export class createStoreInput {
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
  open: string;

  @Field(() => String)
  close: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  addressDetail: string;

  @Field(() => String)
  menuImg: string;

  @Field(() => Int)
  bigDog: number;

  @Field(() => Int)
  smallDog: number;

  @Field(() => [CreatePetInput])
  pet: CreatePetInput[];

  @Field(() => [String])
  storeImage: string[];

  @Field(() => [String])
  storeTag: string[];

  @Field(() => String)
  locationTag: string;
}
