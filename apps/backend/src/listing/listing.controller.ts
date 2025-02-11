import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { Request } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post()
  create(@Body() createListingDto: CreateListingDto, @Req() request: Request) {
    // console.log(request);
    return this.listingService.create(createListingDto, request);
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }

  @Get('all')
  // @UseGuards(AdminGuard)
  findAllForUser() {
    return this.listingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @Req() request: Request,
  ) {
    return this.listingService.update(+id, updateListingDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/listings',
        filename: (req, file, cb) => {
          const name = `${new Date().getTime()}-${file.originalname}`;
          cb(null, name);
        },
      }),
    }),
  )
  uploadImage(@UploadedFiles() files: any, @Body() body: any) {
    console.log(body);
    return this.listingService.fileUpload(files, body);
  }
}
