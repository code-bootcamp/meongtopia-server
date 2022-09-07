import { InputType, PartialType } from '@nestjs/graphql';
import { createReviewInput } from './createReview.input';

@InputType()
export class updateReviewInput extends PartialType(createReviewInput) {}
