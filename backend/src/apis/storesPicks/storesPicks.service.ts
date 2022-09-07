import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Pick } from './entities/storePick.entity';

@Injectable()
export class StoresPicksService {
  constructor(
    @InjectRepository(Pick)
    private readonly pickRepository: Repository<Pick>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async toggle({ storeID, email }) {
    const pickstore = await this.storeRepository.findOne({
      where: { storeID },
    });
    if (pickstore === null) {
      throw new ConflictException('존재하지 않는 가게입니다.');
    }
    const myuser = await this.userRepository.findOne({ where: { email } });
    const allPicks = await this.pickRepository.find({
      relations: ['user', 'store'],
    });

    console.log(allPicks, '========');
    return true;
  }
}
