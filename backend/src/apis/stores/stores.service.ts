import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../pets/entities/pet.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { StoreImage } from '../storesImgs/entities/storeImg.entity';
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
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(StoreTag)
    private readonly storeTagsRepository: Repository<StoreTag>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(StoreImage)
    private readonly storeImageRepository: Repository<StoreImage>,
    @InjectRepository(StrLocationTag)
    private readonly StrLocationTagRepository: Repository<StrLocationTag>,
  ) {}

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
    const locationTag = await this.storeTagsRepository.findOne({
      where: { name },
    });
    const stores = await this.storesRepository.find({
      where: { locationTag },
    });
    return stores;
  }

  async create({ email, createStoreInput }) {
    try {
      //유저 정보 꺼내오기(1-1)
      const user = await this.usersRepository.findOne({ where: { email } });
      const { pet, storeImage, storeTag, locationTag, ...store } =
        createStoreInput;

      //다대다 태그 저장
      const tag = storeTag.map(async (name) => {
        const tag = await this.storeTagsRepository.findOne({
          where: name,
        });
        return tag.tagID;
      });
      const locationTagData = await this.StrLocationTagRepository.findOne({
        where: { name: locationTag },
      });

      //일대일 유저 정보 저장
      const storeData = await this.storesRepository.save({
        user,
        locationTag: locationTagData,
        ...store,
      });

      //펫 이미지 테이블에 저장
      pet.map(async (pet) => {
        await this.petRepository.save({
          ...pet,
          store: storeData,
          storeTag: tag,
        });
      });

      //이미지는 store 저장하고 저장
      storeImage.map(async (url: string) => {
        await this.storeImageRepository.save({
          url,
          store: storeData,
        });
      });

      return storeData;
    } catch (error) {
      throw new error('유저 생성이 실패하였습니다.');
    }
  }

  async update({ email, updateStoreInput }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    const store = await this.storesRepository.findOne({
      where: { user: user },
      relations: ['storeTag', 'locationTag'],
    });
    console.log(store);
    if (!store) {
      throw new ConflictException('해당 상품 정보가 없습니다.');
    }
    //store 이미지 중복생성 방지

    const newStore = this.storesRepository.save({
      ...store,
      ...updateStoreInput,
    });
    return newStore;
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
}
