import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Pick } from './entities/storePick.entity';
import { StoresPicksService } from './storesPicks.service';

@Resolver()
export class StoresPicksResolver {
  constructor(
    private readonly storesPicksService: StoresPicksService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async togglepick(
    @Context() context: any, //
    @Args('storeID') storeID: string,
  ) {
    const email = context.req.user.email;
    return await this.storesPicksService.toggle({ storeID, email });
  }
}
