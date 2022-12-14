import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async find({ email, order }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return this.reservationRepository.find({
      where: { user: { userID: user.userID } },
      relations: ['store', 'store.storeImg', 'store.pet', 'store.storeTag'],
      withDeleted: true,
      order: { createAt: order },
    });
  }

  async findCancel({ email }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    const reservationData = await this.reservationRepository.find({
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
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const point = user.point - createReservationInput.amount;
    this.userRepository.save({
      ...user,
      point,
    });

    const store = await this.storeRepository.findOne({
      where: { storeID },
    });

    //???????????? ???????????? createReservationInput.amount
    const cash = createReservationInput.amount;
    const income = await this.writeIncome({ cash, store });

    const date = getToday();
    const result = await this.reservationRepository.save({
      ...createReservationInput,
      user: user,
      store: store,
      income: income,
      date: date,
    });
    return result;
  }

  async cancel({ email, storeID, date }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const reservation = await this.reservationRepository.findOne({
      where: {
        user: { userID: user.userID },
        store: { storeID },
        date,
      },
      relations: ['user', 'store', 'income'],
    });

    if (!reservation) {
      throw new UnprocessableEntityException('?????? ?????? ???????????? ????????????.');
    }

    //?????? ?????? res?????? ????????? ????????????
    this.reservationRepository.save({
      ...reservation,
      state: 'CANCEL',
    });

    //????????? ?????? ??????
    const amount = reservation.amount;
    const incomeID = reservation.income.incomeID;

    //???????????? ????????? ????????????
    this.userRepository.save({
      ...user,
      point: user.point + amount,
    });

    //income ??????????????? ????????????
    this.deleteIncome({ incomeID, amount });

    const result = await this.reservationRepository.softDelete({
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
    const user = await this.userRepository.findOne({
      where: { email },
    });

    const reservation = await this.reservationRepository.findOne({
      where: {
        store: { storeID },
        user: { userID: user.userID },
        date,
      },
    });
    if (!reservation) {
      throw new UnprocessableEntityException('?????? ????????? ???????????? ????????????.');
    }
  }

  async checkUserPoint({ email, createReservationInput }) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user.point < createReservationInput.amount) {
      throw new UnprocessableEntityException(
        '?????? ????????? ???????????? ???????????????.',
      );
    }
  }

  async changeReservation({ resID }) {
    const reservation = await this.reservationRepository.findOne({
      where: { resID },
      relations: [
        'user',
        'store',
        'income',
        'store.storeImg',
        'store.pet',
        'store.storeTag',
      ],
    });
    if (!reservation) {
      throw new UnprocessableEntityException('?????? ?????? ???????????? ????????????.');
    }
    //?????? ?????? res?????? ????????? ????????????
    const result = await this.reservationRepository.save({
      ...reservation,
      state: 'USED',
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async cancelUserReservation({ email }) {
    //1.????????? ??????
    const user = await this.userRepository.findOne({
      where: { email },
    });
    //2.????????? ???????????? ???????????? ?????? ??????
    const reservations = await this.reservationRepository.find({
      where: {
        user: { userID: user.userID },
      },
    });

    //3. ????????? ???????????? ???????????? ????????? ????????? income??? ????????????
    for (let i = 0; i < reservations.length; i++) {
      const storeID = reservations[i].store.storeID;
      const temp = reservations[i].date.split('-');
      const date = `${temp[1]}/${temp[2]}`;
      const preIconme = await this.incomeRepository.findOne({
        where: {
          store: { storeID },
          date,
        },
      });
      //?????? ?????? +1
      const cancelNum = preIconme.cancelNum + 1;
      //?????? ?????? ??????????????? ??????
      const totalCash = preIconme.totalCash - reservations[i].amount;
      this.incomeRepository.save({
        ...preIconme,
        cancelNum,
        totalCash,
      });
    }
    //4. ?????? ?????? ?????? ?????????
    this.reservationRepository.delete({
      user: { userID: user.userID },
    });
  }

  @Cron('0 1 * * *')
  async checkExpired() {
    const reservations = await this.reservationRepository.find();
    const today = getToday();

    reservations.map((reservation) => {
      //????????? ?????? ????????????
      const ResDate = reservation.date;
      //????????? ??????????????? ????????? ?????????
      let [year, month, date] = ResDate.split('-');
      if (Number(month) + 1 >= 12) {
        year = `${Number(year) + 1}`;
        month = `${Number(month) % 12}`;
        date = date;
      } else {
        month = `${Number(month) + 1}`;
      }
      const compareDate = [year, month, date].join('-');

      //?????? ????????? ????????? ??????????????? state???????????? ????????????
      if (compareDate === today) {
        this.reservationRepository.save({
          ...reservation,
          state: 'EXPIRED',
        });

        this.reservationRepository.softDelete({
          resID: reservation.resID,
          store: { storeID: reservation.store.storeID },
        });
      }
    });
    return '????????? ?????? ??????';
  }
}
