import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  changeAccess(
    @Context() context: any, //
    @Args('userID') userID: string,
  ) {
    const email = context.req.user.email;
    return this.adminService.checkAccess({ email, userID });
  }
}
