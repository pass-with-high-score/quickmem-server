import { UserRoleEnum } from '../enums/user-role.enum';
import { AuthProviderEnum } from '../enums/auth-provider.enum';

export class AuthResponseInterface {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  birthday: Date;
  role: UserRoleEnum;
  provider: AuthProviderEnum;
  coin: number;
  isPremium: boolean;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
}
