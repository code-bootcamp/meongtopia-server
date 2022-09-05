import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: 'http://localhost:3000/login/kakao',
      //scope: ['email', 'profile'],
    });
  }
  validate(accessToken, refreshToken, profile) {
    // console.log(profile.displayName, 'profileeeeee');
    console.log(profile);
    console.log(accessToken);

    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
    }; //req.user 등록
  }
}
