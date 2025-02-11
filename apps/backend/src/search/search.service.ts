import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from 'src/listing/entities/listing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
  ) {}

  searchListings({
    query,
    type,
    city,
    district,
    minPrice,
    maxPrice,
    sortByPrice,
    sortByDate,
    limit,
  }: {
    query: string;
    type?: string;
    city?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    sortByPrice?: 'asc' | 'desc';
    sortByDate?: 'asc' | 'desc';
    limit?: number;
  }): Promise<Listing[]> {
    let queryBuilder = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.user', 'user');
    console.log(query);

    if (query) {
      const searchWords = query.split(' ').filter((word) => word.trim() !== '');
      if (searchWords.length > 0) {
        queryBuilder = queryBuilder.where(
          `(${searchWords.map((word, index) => `listing.title ILIKE :word${index} OR listing.description ILIKE :word${index}`).join(' OR ')})`,
          searchWords.reduce(
            (acc, word, index) => ({ ...acc, [`word${index}`]: `%${word}%` }),
            {},
          ),
        );
      }
    }

    if (type) {
      queryBuilder = queryBuilder.andWhere('listing.type = :type', { type });
    }
    if (city) {
      queryBuilder = queryBuilder.andWhere('LOWER(listing.city) ILIKE :city', {
        city: `%${city.toLowerCase()}%`,
      });
    }
    if (district) {
      queryBuilder = queryBuilder.andWhere('listing.district = :district', {
        district,
      });
    }
    if (minPrice) {
      queryBuilder = queryBuilder.andWhere('listing.price >= :minPrice', {
        minPrice,
      });
    }
    if (maxPrice) {
      queryBuilder = queryBuilder.andWhere('listing.price <= :maxPrice', {
        maxPrice,
      });
    }
    if (sortByPrice === 'asc') {
      queryBuilder = queryBuilder.orderBy('listing.price', 'ASC');
    } else if (sortByPrice === 'desc') {
      queryBuilder = queryBuilder.orderBy('listing.price', 'DESC');
    }
    if (sortByDate === 'asc') {
      queryBuilder = queryBuilder.orderBy('listing.created_at', 'ASC');
    } else if (sortByDate === 'desc') {
      queryBuilder = queryBuilder.orderBy('listing.created_at', 'DESC');
    }
    if (limit) {
      queryBuilder = queryBuilder.limit(limit);
    }

    return queryBuilder.getMany();
  }
}
