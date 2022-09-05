import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresImgsResolver } from './storesImgs.resolver';
import { StoresImgsService } from './storesImgs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //
    ]),
  ],
  providers: [
    StoresImgsResolver, //
    StoresImgsService,
  ],
})
export class StoresImgsModule {}
