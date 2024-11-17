import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { CreateNotificationBodyDto } from './dto/bodies/create-notification-body.dto';
import { CreateNotificationResponseInterface } from './interfaces/create-notification-response.interface';
import { UpdateIsReadBodyDto } from './dto/bodies/update-is-read-body.dto';
import { UpdateIsReadParamDto } from './dto/params/update-is-read-param.dto';
import { UpdateIsReadResponseInterface } from './interfaces/update-is-read-response.interface';
import { DeleteNotificationParamDto } from './dto/params/delete-notification-param.dto';
import { GetNotificationByIdParamDto } from './dto/params/get-notification-by-id-param.dto';
import { GetNotificationByIdResponseInterface } from './interfaces/get-notification-by-id-response.interface';
import { GetNotificationByUserIdParamDto } from './dto/params/get-notification-by-user-id-param.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    createNotificationBodyDto: CreateNotificationBodyDto,
  ): Promise<CreateNotificationResponseInterface[]> {
    return this.notificationRepository.createNotification(
      createNotificationBodyDto,
    );
  }

  async markNotificationAsRead(
    updateIsReadBodyDto: UpdateIsReadBodyDto,
    updateIsReadParamDto: UpdateIsReadParamDto,
  ): Promise<UpdateIsReadResponseInterface> {
    return this.notificationRepository.markNotificationAsRead(
      updateIsReadBodyDto,
      updateIsReadParamDto,
    );
  }

  async deleteNotification(
    deleteNotificationParamDto: DeleteNotificationParamDto,
  ): Promise<void> {
    return this.notificationRepository.deleteNotification(
      deleteNotificationParamDto,
    );
  }

  async getNotificationById(
    getNotificationByIdParamDto: GetNotificationByIdParamDto,
  ): Promise<GetNotificationByIdResponseInterface> {
    return this.notificationRepository.getNotificationById(
      getNotificationByIdParamDto,
    );
  }

  async getNotificationsByUserId(
    getNotificationByUserIdParamDto: GetNotificationByUserIdParamDto,
  ): Promise<GetNotificationByIdResponseInterface[]> {
    return this.notificationRepository.getNotificationsByUserId(
      getNotificationByUserIdParamDto,
    );
  }

  // automatically delete old notifications every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldNotifications(): Promise<void> {
    return this.notificationRepository.deleteOldNotifications();
  }
}
