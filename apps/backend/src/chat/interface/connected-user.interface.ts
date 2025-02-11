import { User } from 'src/user/entities/user.entity';

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  user: User;
}
