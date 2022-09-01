import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { StoreTag } from '../storesTags/entities/storeTag.entity';
import { User } from '../users/entities/user.entity';
import { Store } from './entities/store.entity';
import { StoresResolver } from './stores.resolver';
import { StoresService } from './stores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Store, //
      User,
      Reservation,
      StoreTag,
    ]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [
    StoresService, //
    StoresResolver,
  ],
})
export class StoresModule {}
