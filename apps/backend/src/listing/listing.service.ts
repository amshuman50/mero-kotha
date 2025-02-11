import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { EntityManager, Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class ListingService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    // private readonly listingManager: EntityManager,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createListingDto: CreateListingDto, request: Request) {
    console.log(request.cookies);
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);

    if (!data) throw new UnauthorizedException();

    // console.log(createListingDto);

    const user = await this.userRepository.findOne({
      where: { id: data['id'] },
    });
    console.log('Reached here!');
    console.log(user);

    const item: Listing = new Listing();
    item.user = user;
    Object.assign(item, createListingDto);
    // Object.assign(item, user);

    const result = await this.listingRepository.save(item);
    delete result.user.password;

    return result;
  }

  async findAll() {
    const result = await this.listingRepository.find({ relations: ['user'] });
    result.map((data) => {
      delete data.user.password;
      delete data.user.role;
    });
    return result;
  }

  async findAllForUser(request: Request): Promise<Listing[]> {
    const { jwtService } = this;
    const { cookies } = request;
    const { id: userId } = await jwtService.verifyAsync(cookies['jwt']);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const listings = await this.listingRepository.find({
      where: { user: userId },
    });

    return listings;
  }

  async findOne(id: number) {
    const listing = await this.listingRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    delete listing.user.password;
    delete listing.user.role;
    return listing;
  }

  async update(
    id: number,
    updateListingDto: UpdateListingDto,
    request: Request,
  ) {
    const { jwtService } = this;
    const { cookies } = request;
    const { id: userId } = await jwtService.verifyAsync(cookies['jwt']);

    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (listing.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this listing',
      );
    }

    Object.assign(listing, updateListingDto);

    return this.listingRepository.save(listing);
  }

  remove(id: number) {
    return this.listingRepository.delete(id);
  }

  async fileUpload(files: any, body: any) {
    const { id } = body;
    const filenames = files.map((file) => file.filename);

    const listing = await this.listingRepository.findOne({ where: { id: id } });
    console.log('listing');
    console.log(listing);
    listing.images = [...listing.images, ...filenames];
    await this.listingRepository.save(listing);

    console.log('id :' + id);
    // console.log(filename + ' for id: ' + body.id);
    return { filenames };
    // return 'success';
  }

  //   getTest() {
  //     // const data = this.listingRepository.find();
  //     return { data: 'data' };
  //   }
}
