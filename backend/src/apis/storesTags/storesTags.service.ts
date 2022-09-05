import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreTag } from './entities/storeTag.entity';

@Injectable()
export class StoreTagsService {
  constructor(
    @InjectRepository(StoreTag)
    private readonly storeTagRepository: Repository<StoreTag>,
  ) {}

  async findAll() {
    return await this.storeTagRepository.find();
  }

  async create({ name }) {
    const tag = await this.storeTagRepository.save({
      name,
    });
    return tag;
  }

  async update({ before, after }) {
    const tag = await this.storeTagRepository.findOne({
      where: { name: before },
    });
    if (!tag) {
      throw new ConflictException('존재하지 않는 태그입니다.');
    }

    return await this.storeTagRepository.save({
      name: after,
    });
  }

  async delete({ name }) {
    const result = await this.storeTagRepository.delete({
      name,
    });
    return result.affected ? true : false;
  }
}
