import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from 'src/listing/entities/listing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Listing])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
