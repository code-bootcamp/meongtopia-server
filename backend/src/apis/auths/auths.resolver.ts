import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { AuthService } from './auths.service';
import * as bcrypt from 'bcrypt';
import { IContext } from 'src/commons/type/context';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth.guard';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';
@Resolver()
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    //1. 로그인(이메일이 일치하는 유저를 DB에서 찾기)
    const user = await this.usersService.findUserOne({ email });

    //2. 일치하는 유저가 없으면?(에러 던지기)
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    //3. 일치하는 유저가 있지만 비밀번호가 틀리면?
    const isAuth = bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    //4.refreshToken(=JWT)를 만들어서 프론트 엔드 브라우저 쿠키에 저장해서 보내주기
    this.authService.setRefreshToken({ req: context.req, res: context.res }); // context 안에 있는 res
    //5. 일치하는 유저가 있고, 비밀번호도 맞았다면?
    // => accessToken(=JWT)을 마들어서 브라우저에 전달하기
    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @Context() context: IContext, //
  ) {
    console.log(context.req);
    return this.authService.getAccessToken({ user: context.req.user });
  }

  @Mutation(() => String)
  async logout(
    @Context() context: any, //
  ) {
    const header = JSON.parse(JSON.stringify(context.req.headers));
    const refreshToken = header.cookie.replace('refreshToken=', '');

    const accessToken = header.authorization.replace('Bearer ', '');

    await this.cacheManager.set(
      `refreshToken:${refreshToken}`,
      'refreshToken',
      {
        ttl: 180,
      },
    );
    await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
      ttl: 180,
    });
    try {
      jwt.verify(accessToken, 'myAccessKey'),
        jwt.verify(refreshToken, 'myRefreshKey');
    } catch {
      throw new UnauthorizedException();
    }

    await this.cacheManager.get(`refreshToken:${refreshToken}`);
    await this.cacheManager.get(`accessToken:${accessToken}`);

    // console.log(mycache1, '$$$$$');
    // console.log(mycache2, '*****');
    return '로그아웃에 성공 하였습니다.';
  }
}
