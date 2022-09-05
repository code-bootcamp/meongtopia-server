import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreTag } from './entities/storeTag.entity';
import { StoreTagsResolver } from './storesTags.resolver';
import { StoreTagsService } from './storesTags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreTag, //
    ]),
  ],
  providers: [
    StoreTagsResolver, //
    StoreTagsService,
  ],
})
export class StoreTagsModule {}
