import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AuthResolver } from './auths.resolver';
import { AuthService } from './auths.service';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';
import { JwtGoogleStrategy } from 'src/commons/auth/jwt-social-google.strategy';
import { AuthController } from './auths.controller';
import { JwtKakaoStrategy } from 'src/commons/auth/jwt-social-kakao.strategy';
import { JwtNaverStrategy } from 'src/commons/auth/jwt-social-naver.strategy';
import { Review } from '../reviewes/entities/review.entity';
import { ReviewResponse } from '../reviewesResponses/entities/reviewResponse.entity';
import { Board } from '../boards/entities/board.entity';
import { BoardImg } from '../boardsImgs/entities/boardImg.entity';
import { ReservationsService } from '../reservations/reservations.service';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Store } from '../stores/entities/store.entity';
import { Income } from '../incomes/entities/incomes.entity';
@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User, //
      Review,
      ReviewResponse,
      Board,
      BoardImg,
      Reservation,
      Store,
      Income,
    ]),
  ],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
    AuthResolver, //
    AuthService,
    UsersService,
    ReservationsService,
  ],
  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
