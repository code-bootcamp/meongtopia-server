import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../pets/entities/pet.entity';
import { Review } from '../reviewes/entities/review.entity';
import { StoreImg } from '../storesImgs/entities/storeImg.entity';
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
  async findOne({ storeID }) {
    const result = await this.storesRepository.findOne({
      where: { storeID },
      relations: ['locationTag', 'user', 'storeTag', 'storeImg', 'pet'],
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
    // try {
    //유저 정보 꺼내오기
    const user = await this.usersRepository.findOne({ where: { email } });
    // this.checkAccess({ user });

    const { pet, storeImg, storeTag, locationTag, ...store } = createStoreInput;

    //다대다 태그 저장
    const tag = [];
    for (let i = 0; i < storeTag.length; i++) {
      const tagIs = await this.storeTagsRepository.findOne({
        where: { name: storeTag[i] },
      });
      tag.push(tagIs);
    }

    const locationTagData = await this.StrLocationTagRepository.findOne({
      where: { name: locationTag },
    });
    // if (!locationTagData) {
    //   throw new ConflictException('해당 지역 태그가 없습니다.');
    // }

    //일대일 정보 저장
    const storeData = await this.storesRepository.save({
      user,
      locationTag: locationTagData,
      storeTag: tag,
      ...store,
    });

    //펫 이미지 테이블에 저장
    for (let i = 0; i < pet.length; i++) {
      await this.petRepository.save({
        ...pet[i],
        store: storeData,
        storeTag,
      });
    }

    //이미지는 store 저장하고 저장
    for (let i = 0; i < storeImg.length; i++) {
      const url = storeImg[i];
      await this.storeImageRepository.save({
        url,
        store: storeData,
      });
    }

    return storeData;
    // } catch (error) {
    //   throw new error('가게 생성에 실패하였습니다.');
    // }
  }

  async update({ email, updateStoreInput }) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
      });
      const beforeStore = await this.storesRepository.findOne({
        where: { user: { userID: user.userID } },
      });
      this.storesRepository.softDelete({
        storeID: beforeStore.storeID,
      });
      this.petRepository.delete({
        store: { storeID: beforeStore.storeID },
      });
      this.storeImageRepository.delete({
        store: { storeID: beforeStore.storeID },
      });

      const { pet, storeImg, storeTag, locationTag, ...store } =
        updateStoreInput;

      //다대다 태그 저장
      const tag = [];
      for (let i = 0; i < storeTag.length; i++) {
        const tagIs = await this.storeTagsRepository.findOne({
          where: { name: storeTag[i] },
        });
        tag.push(tagIs);
      }

      const locationTagData = await this.StrLocationTagRepository.findOne({
        where: { name: locationTag },
      });
      // if (!locationTagData) {
      //   throw new ConflictException('해당 지역 태그가 없습니다.');
      // }

      //일대일 정보 저장
      const storeData = await this.storesRepository.save({
        user,
        locationTag: locationTagData,
        storeTag: tag,
        ...store,
      });

      //펫 이미지 테이블에 저장
      for (let i = 0; i < pet.length; i++) {
        await this.petRepository.save({
          ...pet[i],
          store: storeData,
          storeTag,
        });
      }

      //이미지는 store 저장하고 저장
      for (let i = 0; i < storeImg.length; i++) {
        const url = storeImg[i];
        await this.storeImageRepository.save({
          url,
          store: storeData,
        });
      }

      return storeData;
    } catch (error) {
      throw new error();
    }
  }

  async delete({ email }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    const store = await this.storesRepository.findOne({
      where: { user },
    });
    //가게 uuid 가져오기
    const storeID = store.storeID;
    //soft delete 진행
    const result = await this.storesRepository.softDelete(
      storeID, //
    );

    return result.affected ? true : false;
  }

  checkAccess({ user }) {
    if (user.role !== 'OWNER') {
      throw new ConflictException('해당 권한이 존재하지 않습니다.');
    }
    if ((user.access = 'PENDDING')) {
      throw new ConflictException('아직 승인되지 않은 사용장입니다.');
    }
  }
}
