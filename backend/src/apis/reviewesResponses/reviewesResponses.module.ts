import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewesResponsesResolver } from './reviewesResponses.resolver';
import { ReviewesResponsesService } from './reviewesResponses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //
    ]),
  ],
  providers: [
    ReviewesResponsesResolver, //
    ReviewesResponsesService,
  ],
})
export class ReviewesResponsesModule {}
