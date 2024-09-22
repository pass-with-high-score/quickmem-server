import { UserRoleEnum } from '../user-role.enum';

export class AuthResponseInterface {
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  birthday: Date;
  role: UserRoleEnum;
  access_token: string;
  refresh_token: string;
}
