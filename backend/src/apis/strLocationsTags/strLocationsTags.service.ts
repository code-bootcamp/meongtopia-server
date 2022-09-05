import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrLocationTag } from './entities/strLocationTag.entity';

@Injectable()
export class StrLocationsTagsService {
  constructor(
    @InjectRepository(StrLocationTag)
    private readonly StrLocationTagRepository: Repository<StrLocationTag>,
  ) {}

  async findAll() {
    return await this.StrLocationTagRepository.find();
  }

  async create({ name }) {
    const tag = await this.StrLocationTagRepository.save({
      name,
    });
    return tag;
  }

  async update({ before, after }) {
    const tag = await this.StrLocationTagRepository.findOne({
      where: { name: before },
    });
    if (!tag) {
      throw new ConflictException('존재하지 않는 태그입니다.');
    }

    return await this.StrLocationTagRepository.save({
      name: after,
    });
  }

  async delete({ name }) {
    const result = await this.StrLocationTagRepository.delete({
      name,
    });
    return result.affected ? true : false;
  }
}
