import { Resolver } from '@nestjs/graphql';
import { ReviewesService } from './reviewes.service';

@Resolver()
export class ReviewesResolver {
  constructor(
    private readonly reviewesService: ReviewesService, //
  ) {}
}
