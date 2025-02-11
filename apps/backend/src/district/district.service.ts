import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  create(createDistrictDto: CreateDistrictDto) {
    return this.districtRepository.save(createDistrictDto);
  }

  findAll() {
    return this.districtRepository.find();
  }

  findOne(id: number) {
    return this.districtRepository.findOneBy({ id });
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.districtRepository.findOneBy({ id });
    if (!district) throw new NotFoundException('Provided district not found!');

    district.name = updateDistrictDto.name || district.name;
    return this.districtRepository.save(district);
  }

  remove(id: number) {
    return this.districtRepository.delete(id);
  }
}
