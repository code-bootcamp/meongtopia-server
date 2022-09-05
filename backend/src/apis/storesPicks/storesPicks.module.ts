import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresPicksResolver } from './storesPicks.resolver';
import { StoresPicksService } from './storesPicks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //
    ]),
  ],
  providers: [
    StoresPicksResolver, //
    StoresPicksService,
  ],
})
export class StoresPicksModule {}
