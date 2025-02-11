import { User } from 'src/user/entities/user.entity';

export interface RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: User[];
  created_at?: Date;
  updated_at?: Date;
}
