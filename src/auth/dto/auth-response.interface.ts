import { UserRoleEnum } from '../user-role.enum';

export class AuthResponseInterface {
  email: string;
  username: string;
  full_name: string;
  avatar_url: string;
  birthday: Date;
  role: UserRoleEnum;
  access_token: string;
  refresh_token: string;
}
