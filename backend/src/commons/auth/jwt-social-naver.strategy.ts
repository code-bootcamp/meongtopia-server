import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALL_BACK_URL,
      //scope: ['email', 'profile'],
    });
  }
  validate(accessToken, refreshToken, profile) {
    // console.log(profile.displayName, 'profileeeeee');
    console.log(profile, 'profileeeeeeee');
    console.log(accessToken);

    return {
      email: profile._json.email,
      name: profile.displayName,
    }; //req.user 등록
  }
}
