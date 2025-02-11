import { User } from 'src/user/entities/user.entity';
import { RoomI } from './room.interface';

export interface JoinedRoomI {
  id?: number;
  socketId: string;
  user: User;
  room: RoomI;
}
