import { IStats } from './utils';

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  type: string;
  avatar: string;
  balance?: number;
  cover:string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'transgender';
  isOnline?: boolean;
  stats: IStats;
  timezone?: string;
  totalOnlineTime?: number;
  roles?: Array<string>;
  role?: string;
  phone?: string;
}

export interface IUserUpdate {
  //todo - should update
}
