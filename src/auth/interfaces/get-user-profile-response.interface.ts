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
  studySetCount: number;
  folderCount: number;
  createdAt: Date;
  updatedAt: Date;
}
