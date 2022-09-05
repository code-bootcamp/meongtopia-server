import { Resolver } from '@nestjs/graphql';
import { ReviewesResponsesService } from './reviewesResponses.service';

@Resolver()
export class ReviewesResponsesResolver {
  constructor(
    private readonly reviewesResponsesService: ReviewesResponsesService, //
  ) {}
}
