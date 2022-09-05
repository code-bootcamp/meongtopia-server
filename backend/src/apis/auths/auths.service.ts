import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly usersService: UsersService,
  ) {}

  async setRefreshToken({ res, req }) {
    //1. 가입확인
    let user = await this.usersService.findUserOne({ email: req.user.email });
    console.log(user);
    //2. 회원가입
    if (!user) {
      user = await this.usersService.create({
        ...req.user,
        role: 'CLIENT',
      });
    }

    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.userID },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    //쿠키에 넣어준다
    //개발환경
    res.setHeader('Set-Cookie', `refreshToken = ${refreshToken}; path=/;`);
    //배포환경
    //브라우저로 보냄 알아서 다함(team project떄 사용)
    // res.setHeader('Set-Cookie', `refreshToken = ${refreshToken}; path+/boards; domain=.mybacksite.com; SameSite=None; Secure; httpOnly;`)
    // //프론트는 어떤 사이트?
    // res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com')

    return res.redirect('http://localhost:5500/frontend/login/index.html');
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.userID },
      { secret: 'myAccessKey', expiresIn: '5h' },
    );
  }
}
