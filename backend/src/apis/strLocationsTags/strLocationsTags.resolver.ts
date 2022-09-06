import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { StrLocationTag } from './entities/strLocationTag.entity';
import { StrLocationsTagsService } from './strLocationsTags.service';

@Resolver()
export class StrLocationsTagsResolver {
  constructor(
    private readonly strLocationsTagsService: StrLocationsTagsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [StrLocationTag])
  fetchLocationTags() {
    return this.strLocationsTagsService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StrLocationTag)
  createLocationTag(
    @Args('name') name: string, //
  ) {
    return this.strLocationsTagsService.create({ name });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StrLocationTag)
  updateLocationTag(
    @Args('before') before: string, //
    @Args('after') after: string,
  ) {
    return this.strLocationsTagsService.update({ before, after });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLocationTag(
    @Args('name') name: string, //
  ) {
    return this.strLocationsTagsService.delete({ name });
  }
}
