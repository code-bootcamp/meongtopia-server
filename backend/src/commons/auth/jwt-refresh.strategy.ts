import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { Repository } from 'typeorm';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    console.log(payload);
    const header = JSON.parse(JSON.stringify(req.headers));
    const refreshToken = header.cookie.replace('refreshToken=', '');
    const checktoken = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );
    console.log(checktoken, '#######');
    if (checktoken) {
      throw new UnauthorizedException();
    }
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
