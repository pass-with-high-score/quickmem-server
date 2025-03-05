export class AuthResponseInterface {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  birthday: Date;
  provider: string[];
  coin: number;
  isPremium: boolean;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
  userStatus: string;
  bannedAt: Date;
  bannedReason: string;
}
