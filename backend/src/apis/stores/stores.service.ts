import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { StoreTag } from '../storesTags/entities/storeTag.entity';
import { User } from '../users/entities/user.entity';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(StoreTag)
    private readonly storeTagsRepository: Repository<StoreTag>,
  ) {}

  async findTag(name) {
    const aaa = await this.storeTagsRepository.findOne({
      where: { name },
    });
    console.log(aaa);
    // const aaa = await this.storesRepository.find({
    //   where: {},
    // });
  }

  async findLocation() {
    console.log('aa');
  }

  async create({ email, ...createStoreInput }) {
    console.log('aa');
    // try {
    //   const user = await this.usersRepository.findOne(
    //     { where: email }, //
    //   );
    //   const userID = user.userID;

    // } catch (error) {}
  }

  async update() {
    console.log('aa');
  }

  async delete() {
    console.log('aa');
  }
}
