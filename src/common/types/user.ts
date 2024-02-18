import { TPermission } from './permission';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  permissions: TPermission[];
}
