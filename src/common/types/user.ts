export interface IUser {
  sub: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  permissions: string[];
}
