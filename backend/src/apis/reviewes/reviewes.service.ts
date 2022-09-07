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

  async find({ email }) {
    const user: any = await this.userRepository.findOne({
      where: { email },
    });
    const reviewes = await this.reviewRepository.find({
      where: { user: { userID: user.userID } },
    });
    return reviewes;
  }

  async create({ createReviewInput, email, storeID }) {
    const { content, rating } = createReviewInput;
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
    // const avgRating = (store.avgRating + rating) / 2;
    const avgRating = Math.round(((store.avgRating + rating) / 2) * 100) / 100;

    const newStore: any = await this.storeRepository.save({
      ...store,
      avgRating: avgRating,
    });

    const review = await this.reviewRepository.save({
      content,
      rating,
      user,
      store: newStore,
    });
    return review;
  }

  async update({ email, updateReviewInput, storeID }) {
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
    const review = await this.reviewRepository.findOne({
      where: {
        user: { userID: user.userID },
        store: { storeID: store.storeID },
      },
    });

    const result = await this.reviewRepository.save({
      ...review,
      ...updateReviewInput,
    });
    return result;
  }

  async delete({ email }) {
    const user: any = await this.userRepository.findOne({
      where: { email },
    });
    const result = await this.reviewRepository.softDelete({
      user: { userID: user.userID },
    });
    return result.affected ? true : false;
  }
}
