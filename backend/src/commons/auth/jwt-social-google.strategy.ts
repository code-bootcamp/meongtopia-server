import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALL_BACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    return {
      email: profile.emails[0].value,
      hashedPassword: '12312313123312',
      name: profile.displayName,
      nickname: profile.displayName,
      phone: '01011112222',
    };
  }
}
