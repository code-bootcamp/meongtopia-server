import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async find({ email }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return this.reservationsRepository.find({
      where: { user: { userID: user.userID } },
      relations: ['store'],
    });
  }

  async create({ createReservationInput, email, storeID }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    const point = user.point - createReservationInput.amount;
    this.usersRepository.save({
      ...user,
      point,
    });

    const store = await this.storeRepository.findOne({
      where: { storeID },
    });

    return this.reservationsRepository.save({
      ...createReservationInput,
      user,
      store,
    });
  }

  async cancel({ email, storeID }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    const reservation = await this.reservationsRepository.findOne({
      where: {
        user: { userID: user.userID },
        store: { storeID },
      },
    });
    if (!reservation) {
      throw new UnprocessableEntityException('예약 건이 존재하지 않습니다.');
    }
    const result = await this.reservationsRepository.delete({
      user: { userID: user.userID },
      store: { storeID: storeID },
    });
    return result.affected ? true : false;
  }

  async checkReservation({ email, storeID }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    const reservation = await this.reservationsRepository.findOne({
      where: {
        store: { storeID },
        user: { userID: user.userID },
      },
    });
    if (!reservation) {
      throw new UnprocessableEntityException('예약 내역이 존재하지 않습니다.');
    }
  }
  async checkUserPoint({ email, createReservationInput }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (user.point < createReservationInput.amount) {
      throw new UnprocessableEntityException(
        '결제 가능한 포인트가 부족합니다.',
      );
    }
  }
}
