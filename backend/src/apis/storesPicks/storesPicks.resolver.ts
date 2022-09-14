import { UseGuards } from '@nestjs/common';
import { Query, Args, Context, Mutation, Resolver, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { Store } from '../stores/entities/store.entity';
import { Pick } from './entities/storePick.entity';
import { StoresPicksService } from './storesPicks.service';

@Resolver()
export class StoresPicksResolver {
  constructor(
    private readonly storesPicksService: StoresPicksService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Store])
  async fetchPicks(@Context() context: any) {
    const userID = context.req.user;
    console.log(userID, '============');
    return await this.storesPicksService.fetchUserPicks({ userID });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async togglePick(
    @Context() context: any, //
    @Args('storeID') storeID: string,
  ) {
    const email = context.req.user.email;
    return await this.storesPicksService.toggle({ storeID, email });
  }
  @Query(() => Int)
  async fetchPickCount(@Args('storeID') storeID: string) {
    return await this.storesPicksService.PickCount({ storeID });
  }
}
