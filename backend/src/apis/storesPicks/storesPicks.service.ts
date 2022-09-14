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

  async fetchUserPicks({ userID }) {
    const allPicks = await this.pickRepository.find({
      relations: ['user', 'store'],
    });

    const result = [];
    console.log(userID, '1111111');
    for (let i = 0; i < allPicks.length; i++) {
      if (allPicks[i].user.userID === userID.id) {
        result.push(
          await this.storeRepository.findOne({
            where: { storeID: allPicks[i].store.storeID },
          }),
        );
      }
    }
    console.log(result);
    return result;
  }

  async toggle({ storeID, email }) {
    const pickstore: any = await this.storeRepository.findOne({
      where: { storeID },
    });
    if (pickstore === null) {
      throw new ConflictException('존재하지 않는 가게입니다.');
    }
    const myuser: any = await this.userRepository.findOne({ where: { email } });

    const picktrue = await this.pickRepository.findOne({
      where: {
        user: { userID: myuser.userID },
        store: { storeID: pickstore.storeID },
      },
      relations: ['user', 'store'],
    });

    console.log(picktrue);
    if (picktrue) {
      await this.pickRepository.delete({ pickID: picktrue.pickID });
      return false;
    } else {
      await this.pickRepository.save({
        store: pickstore,
        user: myuser,
      });
      return true;
    }
  }

  async PickCount({ storeID }) {
    const allPicks = await this.pickRepository.find({
      relations: ['user', 'store'],
    });

    const result = [];
    for (let i = 0; i < allPicks.length; i++) {
      if (allPicks[i].store.storeID === storeID) {
        result.push(
          await this.userRepository.findOne({
            where: { userID: allPicks[i].user.userID },
          }),
        );
      }
    }
    console.log(result.length);
    return result.length;
  }
}
