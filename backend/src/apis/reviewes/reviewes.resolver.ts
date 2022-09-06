import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Review } from './entities/review.entity';
import { ReviewesService } from './reviewes.service';

@Resolver()
export class ReviewesResolver {
  constructor(
    private readonly reviewesService: ReviewesService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Review)
  createReview(
    @Args('storeID') storeID: string,
    @Args('rating') rating: number,
    @Args('content') content: string,
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.reviewesService.create({ storeID, content, rating, email });
  }
}
