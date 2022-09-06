import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/updateUser.input';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CreateUserInput } from './dto/createUser.input';
import { getToday } from 'src/commons/utils/utils';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return this.usersService.findUserOne({ email });
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10.2);
    const role = 'CLIENT';
    return this.usersService.create({
      ...createUserInput,
      hashedPassword,
      role,
    });
  }

  @Mutation(() => User)
  async createOwner(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10.2);
    const role = 'OWNER';
    return this.usersService.create({
      ...createUserInput,
      hashedPassword,
      role,
    });
  }

  @Mutation(() => User)
  async createAdim(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10.2);
    const role = 'ADMIN';
    return this.usersService.create({
      hashedPassword,
      role,
      ...createUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('email') email: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    //수정하기
    return this.usersService.update({ email, updateUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async uploadFile(
    @Context() context: any, //
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload, //
  ) {
    const email = context.req.user.email;
    console.log(email);
    return await this.usersService.upload({
      files,
      email,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteProfile(
    @Context() context: any, //
  ) {
    const email = context.req.user.email;
    return await this.usersService.deleteprofile({ email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async updateUserPwd(
    @Args('email') email: string,
    @Args('updateUserPwdInput') updateUserPwdInput: string,
  ) {
    console.log(email);
    const hashedPassword = await bcrypt.hash(updateUserPwdInput, 10.2);
    return await this.usersService.updatePwd({ email, hashedPassword });
  }

  @Mutation(() => Boolean)
  deleteUser(
    @Args('email') email: string, //
  ) {
    return this.usersService.delete({ email });
  }

  @Mutation(() => String)
  async getToken(@Args('phone') phone: string) {
    return await this.usersService.sendTokenSMS({ phone });
  }

  @Mutation(() => String)
  async checkValidToken(
    @Args('phone') phone: string,
    @Args('token') token: string,
  ) {
    return await this.usersService.matchToken({ phone, token });
  }
}
