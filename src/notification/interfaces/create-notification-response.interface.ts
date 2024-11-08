export interface CreateNotificationResponseInterface {
  id: string;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
