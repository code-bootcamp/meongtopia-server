import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALL_BACK_URL,
      //scope: ['email', 'profile'],
    });
  }
  validate(accessToken, refreshToken, profile) {
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
      hashedPassword: '12312313123312',
      nickname: profile.displayName,
      phone: '01011112222',
    }; //req.user 등록
  }
}
