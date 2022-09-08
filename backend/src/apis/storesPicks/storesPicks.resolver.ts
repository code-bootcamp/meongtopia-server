import { UseGuards } from '@nestjs/common';
import { Query, Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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
  async togglepick(
    @Context() context: any, //
    @Args('storeID') storeID: string,
  ) {
    const email = context.req.user.email;
    return await this.storesPicksService.toggle({ storeID, email });
  }
}
