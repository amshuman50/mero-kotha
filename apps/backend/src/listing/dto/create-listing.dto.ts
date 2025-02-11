import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateListingDto {
  title: string;
  user: CreateUserDto;
  description: string;
  price: number;
  city: string;
  district: string;
  area: number;
  stories: number;
  bedroom: number;
  bathroom: number;
  kitchen: number;
  recommended_price: number;
  car_parking: number;
  created_at?: Date;
  updated_at?: Date;
}
