import { UserRoleEnum } from '../user-role.enum';

export class AuthResponseInterface {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  birthday: Date;
  role: UserRoleEnum;
  accessToken: string;
  refreshToken: string;
}
