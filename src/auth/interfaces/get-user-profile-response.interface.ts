export interface GetUserProfileResponseInterface {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatarUrl: string;
  role: string;
  coin: number;
  userStatus: string;
  bannedAt: Date;
  bannedReason: string;
  createdAt: Date;
  updatedAt: Date;
}
