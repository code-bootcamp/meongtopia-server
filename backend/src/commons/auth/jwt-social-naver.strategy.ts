import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_CALL_BACK_URL,
      scope: ['email', 'profile'],
    });
  }
  validate(accessToken, refreshToken, profile) {
    return {
      email: profile._json.email,
      name: profile.displayName,
      hashedPassword: '12312313123312',
      nickname: profile.displayName,
      phone: '010011112222',
    };
  }
}
