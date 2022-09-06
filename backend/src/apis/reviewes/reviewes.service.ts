import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Review } from './entities/review.entity';
import { Store } from '../stores/entities/store.entity';
@Injectable()
export class ReviewesService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create({ storeID, content, rating, email }) {
    const user: any = await this.userRepository.findOne({
      where: { email },
    });

    const store: any = await this.storeRepository.findOne({
      where: { storeID },
      relations: ['locationTag', 'user', 'storeTag'],
    });
    if (!store) {
      throw new ConflictException('해당 가게 정보가 없습니다.');
    }
    //평균 평점 변경하기
    const avgRating = (store.avgRating + rating) / 2;

    const newStore: any = this.storeRepository.save({
      ...store,
      avgRating: avgRating,
    });

    const review = await this.reviewRepository.save({
      content,
      rating,
      user,
      store: newStore.storeID,
    });
    return review;
  }
}
