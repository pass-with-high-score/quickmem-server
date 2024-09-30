import { UserRoleEnum } from '../user-role.enum';
import { AuthProviderEnum } from '../auth-provider.enum';

export class AuthResponseInterface {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  birthday: Date;
  role: UserRoleEnum;
  provider: AuthProviderEnum;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
}
