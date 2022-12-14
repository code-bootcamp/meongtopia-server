import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Income } from '../incomes/entities/incomes.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Review } from '../reviewes/entities/review.entity';
import { ReviewResponse } from '../reviewesResponses/entities/reviewResponse.entity';
import { StoreImg } from '../storesImgs/entities/storeImg.entity';
import { Pick } from '../storesPicks/entities/storePick.entity';
import { StoreTag } from '../storesTags/entities/storeTag.entity';
import { StrLocationTag } from '../strLocationsTags/entities/strLocationTag.entity';
import { User } from '../users/entities/user.entity';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storesRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(StoreTag)
    private readonly storeTagsRepository: Repository<StoreTag>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(StoreImg)
    private readonly storeImageRepository: Repository<StoreImg>,
    @InjectRepository(StrLocationTag)
    private readonly StrLocationTagRepository: Repository<StrLocationTag>,
    @InjectRepository(Pick)
    private readonly pickRepository: Repository<Pick>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReviewResponse)
    private readonly reviewResponseRepository: Repository<ReviewResponse>,

    private readonly dataSource: DataSource,
  ) {}

  async find({ page, order }) {
    const result = await this.storesRepository.find({
      relations: ['locationTag', 'user', 'storeTag', 'storeImg', 'pet'],
      skip: (page - 1) * 10,
      take: 10,
      order: { createdAt: order },
    });
    return result;
  }

  async findOwnerStores({ email }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    const result = await this.storesRepository.find({
      where: {
        user: { userID: user.userID },
      },
      relations: [
        'locationTag',
        'user',
        'storeTag',
        'storeImg',
        'pet',
        'reservation',
        'reservation.user',
      ],
    });
    return result;
  }

  async findOne({ storeID }) {
    const result = await this.storesRepository.findOne({
      where: { storeID },
      relations: [
        'locationTag',
        'user',
        'storeTag',
        'storeImg',
        'pet',
        'reservation',
        'reservation.user',
      ],
    });
    return result;
  }

  async findTag({ name }) {
    const storeTag = await this.storeTagsRepository.findOne({
      where: { name },
    });
    const stores = await this.storesRepository.find({
      where: { storeTag },
    });
    return stores;
  }

  async findLocation({ name }) {
    const locationTag: any = await this.storeTagsRepository.findOne({
      where: { name },
    });
    const stores = await this.storesRepository.find({
      where: { locationTag },
    });
    return stores;
  }

  async findPickRank({ order }) {
    const stores = await this.storesRepository.find({
      relations: ['locationTag', 'user', 'storeTag', 'storeImg', 'pet'],
      take: 3,
      order: { pickCount: order },
    });
    return stores;
  }
  async create({ email, createStoreInput }) {
    try {
      // ?????? ?????? ????????????
      const user = await this.usersRepository.findOne({ where: { email } });
      this.checkAccess({ user });
      const { pet, storeImg, storeTag, locationTag, ...store } =
        createStoreInput;
      // ?????? ??????
      const tag = [];
      for (let i = 0; i < storeTag.length; i++) {
        const tagIs = await this.storeTagsRepository.findOne({
          where: { name: storeTag[i] },
        });
        tag.push(tagIs);
      }
      // ???????????? ??????
      const locationTagData = await this.StrLocationTagRepository.findOne({
        where: { name: locationTag },
      });
      if (!locationTagData) {
        throw new ConflictException('?????? ?????? ????????? ????????????.');
      }

      const storeData = await this.storesRepository.save({
        user,
        locationTag: locationTagData,
        storeTag: tag,
        ...store,
      });

      //??? ????????? ???????????? ??????
      for (let i = 0; i < pet.length; i++) {
        await this.petRepository.save({
          ...pet[i],
          store: storeData,
          storeTag,
        });
      }

      //???????????? store ???????????? ??????
      for (let i = 0; i < storeImg.length; i++) {
        const url = storeImg[i];
        await this.storeImageRepository.save({
          url,
          store: storeData,
        });
      }

      return storeData;
    } catch (error) {
      return error;
    }
  }

  async update({ email, updateStoreInput, storeID }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    const { pet, storeImg, storeTag, locationTag, ...storeInput } =
      updateStoreInput;

    //????????? ?????? ?????? ????????????
    let storeData = await this.storesRepository.findOne({
      where: {
        user: { userID: user.userID },
        storeID,
      },
    });
    //1. ?????? ????????????
    if (storeTag) {
      //1-1 ?????? ?????? ???????????? (????????????????????? ???????????? ????????? ????????????)
      await this.dataSource.manager
        .createQueryBuilder()
        .delete()
        .from('store_store_tag_store_tag')
        .where('storeStoreID = :storeStoreID', { storeStoreID: storeID })
        .execute();
      //1-2 ?????? ?????? ????????????
      const tag = [];
      for (let i = 0; i < storeTag.length; i++) {
        const tagIs = await this.storeTagsRepository.findOne({
          where: { name: storeTag[i] },
        });
        tag.push(tagIs);
      }
      storeData = await this.storesRepository.save({
        ...storeData,
        user,
        storeTag: tag,
      });
    }

    //2. ?????? ?????? ????????????
    if (locationTag) {
      //2-1. ?????? ?????? ?????? ????????????
      const locationTagData: any = await this.StrLocationTagRepository.findOne({
        where: { name: locationTag },
      });
      if (!locationTagData) {
        throw new ConflictException('?????? ?????? ????????? ????????????.');
      }
      storeData = await this.storesRepository.save({
        ...storeData,
        user,
        locationTag: locationTagData,
      });
    }

    //3. ?????? ?????? ????????????
    storeData = await this.storesRepository.save({
      ...storeData,
      ...storeInput,
    });

    //4. ??? ????????????
    if (pet) {
      //4-1?????? ??? ?????? ????????????
      this.petRepository.delete({
        store: { storeID },
      });
      //4-2????????? ??? ?????? ????????????
      for (let i = 0; i < pet.length; i++) {
        await this.petRepository.save({
          ...pet[i],
          store: storeData,
        });
      }
    }

    //5. ?????? ????????? ????????????
    if (storeImg) {
      //5-1. ?????? ????????? ??????
      this.storeImageRepository.delete({
        store: { storeID },
      });
      //5-1. ????????? ????????? ??????
      for (let i = 0; i < storeImg.length; i++) {
        const url = storeImg[i];
        await this.storeImageRepository.save({
          url,
          store: storeData,
        });
      }
    }
  }

  async delete({ storeID }) {
    // soft delete ??????
    const result = await this.storesRepository.softDelete(
      storeID, //
    );
    this.pickRepository.delete({
      store: { storeID },
    });
    this.petRepository.delete({
      store: { storeID },
    });
    this.storeImageRepository.delete({
      store: { storeID },
    });
    this.incomeRepository.delete({
      store: { storeID },
    });
    //????????? ???????????? ?????????
    const reviews = await this.reviewRepository.find({
      where: { store: { storeID } },
      relations: ['store', 'user', 'reviewRes'],
    });

    for (let i = 0; i < reviews.length; i++) {
      this.reviewResponseRepository.delete({
        reviewResID: reviews[i].reviewRes.reviewResID,
      });
    }

    this.reviewRepository.delete({
      store: { storeID },
    });

    const reservation = await this.reservationRepository.find({
      where: { store: { storeID } },
    });
    //?????? ???????????? ????????? ????????? ?????????
    for (let i = 0; i < reservation.length; i++) {
      this.reservationRepository.save({
        ...reservation[i],
        state: 'CANCEL',
      });
    }
    //?????? ????????????
    this.reservationRepository.delete({
      store: { storeID },
    });

    // ????????????????????? ????????? ?????? ??????
    await this.dataSource.manager
      .createQueryBuilder()
      .delete()
      .from('store_store_tag_store_tag')
      .where('storeStoreID = :storeStoreID', { storeStoreID: storeID })
      .execute();

    return result.affected ? true : false;
  }

  checkAccess({ user }) {
    if (user.role !== 'OWNER') {
      throw new ConflictException('?????? ????????? ???????????? ????????????.');
    }
    if ((user.access = 'PENDDING')) {
      throw new ConflictException('?????? ???????????? ?????? ???????????????.');
    }
  }
}
