import { UserType } from "./userType";

export interface ListingType {
  id: number;
  title: string;
  type: string;
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
  images: string[];
  created_at?: Date;
  updated_at?: Date;
  user: UserType;
}
