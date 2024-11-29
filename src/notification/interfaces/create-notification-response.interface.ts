export interface CreateNotificationResponseInterface {
  id: string;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  notificationType: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}
