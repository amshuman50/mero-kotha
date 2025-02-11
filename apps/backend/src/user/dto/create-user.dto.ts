export class CreateUserDto {
  email: string;

  name: string;

  phone: number;

  password: string;

  role: number;

  created_at?: Date;

  updated_at?: Date;
}
