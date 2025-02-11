import { User } from 'src/user/entities/user.entity';
import { RoomI } from './room.interface';

export interface MessageI {
  id?: number;
  text: string;
  user: User;
  room: RoomI;
  created_at: Date;
  updated_at: Date;
}
