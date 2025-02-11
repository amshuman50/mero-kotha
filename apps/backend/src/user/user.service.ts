import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing)
      throw new BadRequestException({ message: 'Email already in use!' });
    const data: User = new User();
    data.email = createUserDto.email;
    data.name = createUserDto.name;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    data.password = hashedPassword;

    const result = this.userRepository.save(data);
    delete (await result).password;
    return result;
  }

  async login(createUserDto: CreateUserDto, response: Response): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (!user)
      throw new BadRequestException({ message: 'Invalid Credentials!' });

    if (!(await bcrypt.compare(createUserDto.password, user.password))) {
      throw new BadRequestException('Invalid Creadentials!');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });
    response.cookie('role', user.role);

    // return { token: jwt, role: user.role };
    return { message: 'Logged in Successfully!' };
  }

  async user(request: Request): Promise<any> {
    try {
      // console.log('REQUEST: ' + request.cookies['jwt']);
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      const user = await this.userRepository.findOne({
        where: { id: data['id'] },
      });

      delete user.password;

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async logout(response: Response): Promise<any> {
    response.clearCookie('jwt');
    response.clearCookie('role');
    try {
      response.clearCookie('user_id');
    } catch (error) {
      /* Do nothing */
    }
    return { message: 'logged out successfully!' };
  }

  async findAll(request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      const user = await this.userRepository.findOne({
        where: { id: data['id'] },
      });

      if (user.role === 1) {
        return this.userRepository.find();
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  findOne(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    request: Request,
  ): Promise<User> {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      const user = await this.userRepository.findOne({
        where: { id: data['id'] },
      });

      if (user.id === id || user.role === 1) {
        user.email = updateUserDto.email;
        user.name = updateUserDto.name;
        user.phone = updateUserDto.phone;
        if (updateUserDto.password) {
          const hashedPassword = await bcrypt.hash(updateUserDto.password, 12);
          user.password = hashedPassword;
        }
        const result = await this.userRepository.save(user);
        delete result.password;
        return result;
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async remove(id: number, request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      const user = await this.userRepository.findOne({
        where: { id: data['id'] },
      });

      if (user.id === id || user.role === 1) {
        return this.userRepository.delete(id);
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async getById(id: number, request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) throw new UnauthorizedException();

      const user = await this.userRepository.findOne({
        where: { id: data['id'] },
      });

      if (user.id === id || user.role === 1) {
        return this.userRepository.findOne({ where: { id } });
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async avatarUpload(file: any, body: any) {
    const { id } = body;
    const filename = file.filename;

    const user = await this.userRepository.findOne({ where: { id: id } });
    user.avatar = filename;
    await this.userRepository.save(user);

    return { filename };
  }

  guardTest() {
    return 'inside guardTest()';
  }
}
