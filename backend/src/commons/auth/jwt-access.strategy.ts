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
      //위와 동일한 코드
      //   jwtFromRequest: (req) => {
      //     const accessToken = req.headers.Authorization; //"Bearer tokenText"
      //     const result = accessToken.replace('Bearer', '');
      //     return result;
      //   },
      secretOrKey: 'myAccessKey',
    });
  }

  async validate(req, payload) {
    console.log(payload);
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
