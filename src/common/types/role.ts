import { TPermission } from './permission';

export type IRole = {
  _id: string;
  companyId: string;
  name: string;
  permissions: TPermission[];
};
