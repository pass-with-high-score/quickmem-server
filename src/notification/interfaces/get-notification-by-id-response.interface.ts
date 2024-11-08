export interface GetNotificationByIdResponseInterface {
  id: string;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
