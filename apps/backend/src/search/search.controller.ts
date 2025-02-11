import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Listing } from 'src/listing/entities/listing.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchListings(
    @Query('query') query: string,
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('district') district?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortByPrice') sortByPrice?: 'asc' | 'desc',
    @Query('sortByDate') sortByDate?: 'asc' | 'desc',
    @Query('limit') limit?: number,
  ): Promise<Listing[]> {
    return this.searchService.searchListings({
      query,
      type,
      city,
      district,
      minPrice,
      maxPrice,
      sortByPrice,
      sortByDate,
      limit,
    });
  }
}
