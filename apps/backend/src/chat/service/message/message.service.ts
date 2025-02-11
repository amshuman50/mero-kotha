import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { MessageI } from 'src/chat/interface/message.interface';
import { RoomI } from 'src/chat/interface/room.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    if (message.room.id)
      return this.messageRepository.save(
        this.messageRepository.create(message),
      );
  }

  async findMessagesForRoom(room: RoomI): Promise<MessageI[]> {
    // return this.messageRepository.find({
    //   where: { room: room.id },
    //   relations: ['user', 'room'],
    // });
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'ASC');

    const messages = await query.getMany();
    return messages;
  }
}
