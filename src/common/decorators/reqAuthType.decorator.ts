import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../types/authType';

export const REQ_AUTH_TYPE_KEY = 'reqAuthType';

export const ReqAuthType = (...authTypes: AuthType[]) => SetMetadata(REQ_AUTH_TYPE_KEY, authTypes);
