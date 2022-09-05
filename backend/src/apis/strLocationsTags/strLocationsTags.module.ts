import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrLocationTag } from './entities/strLocationTag.entity';
import { StrLocationsTagsResolver } from './strLocationsTags.resolver';
import { StrLocationsTagsService } from './strLocationsTags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StrLocationTag, //
    ]),
  ],
  providers: [
    StrLocationsTagsResolver, //
    StrLocationsTagsService,
  ],
})
export class StrLocationsTagsModule {}
