import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { createReviewInput } from './dto/createReview.input';
import { updateReviewInput } from './dto/updateReview.input';
import { Review } from './entities/review.entity';
import { ReviewesService } from './reviewes.service';

@Resolver()
export class ReviewesResolver {
  constructor(
    private readonly reviewesService: ReviewesService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Review])
  fetchReview(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.reviewesService.find({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: createReviewInput, //
    @Args('storeID') storeID: string,
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.reviewesService.create({ createReviewInput, email, storeID });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  updateReview(
    @Args('updateReviewInput') updateReviewInput: updateReviewInput, //
    @Args('storeID') storeID: string,
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.reviewesService.update({ updateReviewInput, email, storeID });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteReview(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.reviewesService.delete({ email });
  }
}
