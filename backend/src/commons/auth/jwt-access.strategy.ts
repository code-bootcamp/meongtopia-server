import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { Repository } from 'typeorm';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const header = JSON.parse(JSON.stringify(req.headers));
    const accessToken = header.authorization.replace('Bearer ', '');

    const checktoken = await this.cacheManager.get(
      `accessToken:${accessToken}`,
    );
    console.log(checktoken);
    if (checktoken) {
      throw new UnauthorizedException();
    }
    return {
      email: payload.email,
      id: payload.sub,
    };
  }
}
