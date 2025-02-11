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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';
import { UserGuard } from './user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.userService.login(createUserDto, response);
  }

  @Get()
  user(@Req() request: Request) {
    return this.userService.user(request);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.userService.logout(response);
  }

  @Get('/all')
  findAll(@Req() request: Request) {
    return this.userService.findAll(request);
  }

  @Get('guard')
  @UseGuards(UserGuard)
  testGuard(@Req() request: Request) {
    console.log('guard');
    return this.userService.user(request);
    // return 'guard test';
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return this.userService.update(+id, updateUserDto, request);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.userService.remove(+id, request);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Req() request: Request) {
    return this.userService.getById(+id, request);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const name = `${new Date().getTime()}-${file.originalname}`;
          cb(null, name);
        },
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file: any, @Body() body: any) {
    return this.userService.avatarUpload(file, body);
  }
}
