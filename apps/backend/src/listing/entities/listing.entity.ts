import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.listings, { cascade: true })
  @JoinColumn()
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    enum: ['house', 'floor', 'apartment'],
  })
  type: 'house' | 'floor' | 'apartment';

  @Column()
  price: number;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column('float')
  area: number;

  @Column('float')
  stories: number;

  @Column()
  bedroom: number;

  @Column()
  bathroom: number;

  @Column()
  kitchen: number;

  @Column({ default: 0 })
  recommended_price: number;

  @Column()
  car_parking: number;

  @Column({ type: 'text', array: true, default: [] })
  images: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
