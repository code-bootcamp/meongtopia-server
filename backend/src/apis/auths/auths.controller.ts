import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../users/users.service';
import { AuthService } from './auths.service';
import { Request, Response } from 'express';

interface IOAuthUser {
  user: {
    name: string;
    phonenumber: number;
    email: string;
    address: string;
    hashedPassword: string;
    signupdate: Date;
    age: number;
  };
}

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UserService, //
    private readonly authService: AuthService,
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.setRefreshToken({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.setRefreshToken({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.setRefreshToken({ req, res });
  }
}
