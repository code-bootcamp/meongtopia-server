import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkAccess({ email, userID }) {
    //관리자 정보
    const admin = await this.userRepository.findOne({
      where: { email },
    });
    this.checkUser({ admin });
    //바꾸려는 사용자 userID
    const preUser = await this.userRepository.findOne({
      where: { userID },
    });
    if (preUser.access === 'ALLOWED') {
      throw new ConflictException('이미 승인된 사용자입니다.');
    }
    const result = await this.userRepository.save({
      ...preUser,
      access: 'ALLOWED',
    });
    return result !== null ? true : false;
  }

  checkUser({ admin }) {
    if (!admin) {
      throw new ConflictException('해당 사용자가 존재하지 않습니다.');
    }
    if (admin.role !== 'ADMIN') {
      throw new ConflictException('관리자가 아닙니다.');
    }
  }
}
