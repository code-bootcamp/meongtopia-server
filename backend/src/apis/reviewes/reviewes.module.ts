import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewesResolver } from './reviewes.resolver';
import { ReviewesService } from './reviewes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //
    ]),
  ],
  providers: [
    ReviewesResolver, //
    ReviewesService,
  ],
})
export class ReviewesModule {}
