import { SetMetadata } from '@nestjs/common';
import { memberType } from '../constants/enum';

export const REQUEST_ACCESS_USER_TYPE = 'request_access_user_type';
export const AllowAccess = (...authority: memberType[]) => SetMetadata(REQUEST_ACCESS_USER_TYPE, authority);
