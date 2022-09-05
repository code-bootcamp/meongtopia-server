import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { StoreTag } from './entities/storeTag.entity';
import { StoreTagsService } from './storesTags.service';

@Resolver()
export class StoreTagsResolver {
  constructor(
    private readonly storeTagsService: StoreTagsService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [StoreTag])
  fetchTags() {
    return this.storeTagsService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StoreTag)
  createTag(
    @Args('name') name: string, //
  ) {
    return this.storeTagsService.create({ name });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => StoreTag)
  updateTag(
    @Args('before') before: string, //
    @Args('after') after: string,
  ) {
    return this.storeTagsService.update({ before, after });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteTag(
    @Args('name') name: string, //
  ) {
    return this.storeTagsService.delete({ name });
  }
}
