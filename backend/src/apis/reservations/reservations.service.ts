import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDate, getToday } from 'src/commons/utils/utils';
import { Repository } from 'typeorm';
import { Income } from '../incomes/entities/incomes.entity';
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
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async find({ email, order }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return this.reservationsRepository.find({
      where: { user: { userID: user.userID } },
      relations: ['store', 'store.storeImg', 'store.pet', 'store.storeTag'],
      withDeleted: true,
      order: { createAt: order },
    });
  }

  async findCancel({ email }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    const reservationData = await this.reservationsRepository.find({
      where: {
        user: { userID: user.userID },
      },
      relations: ['store', 'store.storeImg', 'store.pet', 'store.storeTag'],
      withDeleted: true,
    });
    const result = [];
    for (let i = 0; i < reservationData.length; i++) {
      if (reservationData[i].deletedAt !== null)
        result.push(reservationData[i]);
    }
    return result;
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

    //수입내역 수정하기 createReservationInput.amount
    const cash = createReservationInput.amount;
    const income = await this.writeIncome({ cash, store });

    const date = getToday();
    const result = await this.reservationsRepository.save({
      ...createReservationInput,
      user: user,
      store: store,
      income: income,
      date: date,
    });
    return result;
  }

  async cancel({ email, storeID, date }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    const reservation = await this.reservationsRepository.findOne({
      where: {
        user: { userID: user.userID },
        store: { storeID },
        date,
      },
      relations: ['user', 'store', 'income'],
    });

    if (!reservation) {
      throw new UnprocessableEntityException('예약 건이 존재하지 않습니다.');
    }
    const amount = reservation.amount;
    const incomeID = reservation.income.incomeID;
    //유저에게 포인트 돌려주기
    this.usersRepository.save({
      ...user,
      point: user.point + amount,
    });
    //income 결제취소건 반영하기
    this.deleteIncome({ incomeID, amount });
    const result = await this.reservationsRepository.softDelete({
      user: { userID: user.userID },
      store: { storeID: storeID },
      date,
    });
    return result.affected ? true : false;
  }

  async writeIncome({ cash, store }) {
    const date: any = getDate();
    const income = await this.incomeRepository.findOne({
      where: {
        store: { storeID: store.storeID },
        date: date,
      },
      relations: ['store'],
    });

    if (!income) {
      return this.incomeRepository.save({
        date: date,
        paymentNum: 1,
        totalCash: cash,
        store,
      });
    } else {
      const incomeData = await this.incomeRepository.findOne({
        where: {
          date: date,
          store: { storeID: store.storeID },
        },
        relations: ['store'],
      });
      const totalCash = incomeData.totalCash + cash;
      const paymentNum = incomeData.paymentNum + 1;
      return this.incomeRepository.save({
        ...incomeData,
        date: date,
        paymentNum,
        totalCash,
      });
    }
  }

  async deleteIncome({ incomeID, amount }) {
    const incomeData = await this.incomeRepository.findOne({
      where: { incomeID },
      relations: ['store'],
    });

    const totalCash = incomeData.totalCash - amount;
    const cancelNum = incomeData.cancelNum + 1;

    const result = await this.incomeRepository.save({
      ...incomeData,
      totalCash,
      cancelNum,
    });

    return result;
  }

  async checkReservation({ email, storeID, date }) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    const reservation = await this.reservationsRepository.findOne({
      where: {
        store: { storeID },
        user: { userID: user.userID },
        date,
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
