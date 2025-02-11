import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/entities/connected-user.entity';
import { ConnectedUserI } from 'src/chat/interface/connected-user.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
    // return this.connectedUserRepository.save(connectedUser);
    try {
      return await this.connectedUserRepository.save(connectedUser);
    } catch (error) {
      if (error.code === '23505') {
        // Handle duplicate key error by updating socketId
        const existingUser = await this.connectedUserRepository.findOne({
          where: { user: connectedUser.user },
        });
        if (existingUser) {
          // Update socketId with the new value
          existingUser.socketId = connectedUser.socketId;
          return this.connectedUserRepository.save(existingUser);
        } else {
          // If record doesn't exist, re-throw the error
          throw error;
        }
      } else {
        // Re-throw the error if it's not a duplicate key error
        throw error;
      }
    }
  }

  async findByUser(user: User): Promise<ConnectedUserI[]> {
    return this.connectedUserRepository.find({ where: { user: user } });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository.createQueryBuilder().delete().execute();
  }
}
