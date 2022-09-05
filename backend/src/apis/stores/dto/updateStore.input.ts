import { InputType, PartialType } from '@nestjs/graphql';
import { createStoreInput } from './createStore.input';

@InputType()
export class updateStoreInput extends PartialType(createStoreInput) {}
