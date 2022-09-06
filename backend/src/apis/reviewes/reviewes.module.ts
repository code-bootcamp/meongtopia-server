import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../stores/entities/store.entity';
import { StoresService } from '../stores/stores.service';
import { User } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';
import { ReviewesResolver } from './reviewes.resolver';
import { ReviewesService } from './reviewes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Store,
      User, //
    ]),
  ],
  providers: [
    ReviewesResolver, //
    ReviewesService,
  ],
})
export class ReviewesModule {}
