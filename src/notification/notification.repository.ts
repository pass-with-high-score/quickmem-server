import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In, LessThan, Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { CreateNotificationBodyDto } from './dto/bodies/create-notification-body.dto';
import { UserEntity } from '../auth/entities/user.entity';
import { logger } from '../winston-logger.service';
import { CreateNotificationResponseInterface } from './interfaces/create-notification-response.interface';
import { UpdateIsReadBodyDto } from './dto/bodies/update-is-read-body.dto';
import { UpdateIsReadParamDto } from './dto/params/update-is-read-param.dto';
import { UpdateIsReadResponseInterface } from './interfaces/update-is-read-response.interface';
import { DeleteNotificationParamDto } from './dto/params/delete-notification-param.dto';
import { GetNotificationByIdParamDto } from './dto/params/get-notification-by-id-param.dto';
import { GetNotificationByIdResponseInterface } from './interfaces/get-notification-by-id-response.interface';
import { GetNotificationByUserIdParamDto } from './dto/params/get-notification-by-user-id-param.dto';
import { MessagingService } from '../firebase/messaging.service';
import { IMessaginToTokensParams } from '../firebase/imessaging.interface';
import { DeviceEntity } from '../firebase/entities/device.entity';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly messagingService: MessagingService,
  ) {
    super(NotificationEntity, dataSource.createEntityManager());
  }

  // create notification
  async createNotification(
    createNotificationBodyDto: CreateNotificationBodyDto,
  ): Promise<CreateNotificationResponseInterface[]> {
    const { title, message, userId, notificationType, data } =
      createNotificationBodyDto;
    const notifications: CreateNotificationResponseInterface[] = [];

    for (const id of userId) {
      const userEntity = await this.dataSource
        .getRepository(UserEntity)
        .findOne({ where: { id } });
      if (!userEntity) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const notification = new NotificationEntity();
      notification.title = title;
      notification.message = message;
      notification.user = userEntity;
      notification.notificationType = notificationType;
      notification.data = data;
      try {
        await this.save(notification);
        notifications.push({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          userId: notification.user.id,
          isRead: notification.isRead,
          notificationType: notification.notificationType,
          data: notification.data,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        });
      } catch (error) {
        logger.error(error);
        throw new InternalServerErrorException('Failed to create notification');
      }
    }

    if (notificationType === 'INVITE_USER_JOIN_CLASS') {
      await this.sendNotification(title, message, userId, {
        notificationType,
        id: data.id,
        code: data.code,
      });
    } else if (notificationType === 'REPORT_CREATED') {
      await this.sendNotification(title, message, userId, {
        notificationType,
        id: data.reportId,
      });
    } else if (notificationType === 'NONE') {
      await this.sendNotification(title, message, userId, {
        notificationType,
      });
    }

    return notifications;
  }

  // path notification is read
  async markNotificationAsRead(
    updateIsReadBodyDto: UpdateIsReadBodyDto,
    updateIsReadParamDto: UpdateIsReadParamDto,
  ): Promise<UpdateIsReadResponseInterface> {
    const { isRead } = updateIsReadBodyDto;
    const { id } = updateIsReadParamDto;

    const notification = await this.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = isRead;
    try {
      await this.save(notification);
      return {
        id: notification.id,
        message: 'Notification updated successfully',
        isRead: notification.isRead,
      };
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  // delete notification
  async deleteNotification(
    deleteNotificationParamDto: DeleteNotificationParamDto,
  ): Promise<void> {
    const { id } = deleteNotificationParamDto;
    const notification = await this.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    try {
      await this.delete(id);
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }

  // get notification by id
  async getNotificationById(
    getNotificationByIdParamDto: GetNotificationByIdParamDto,
  ): Promise<GetNotificationByIdResponseInterface> {
    const { id } = getNotificationByIdParamDto;
    const notification = await this.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      notificationType: notification.notificationType,
      data: notification.data,
      userId: notification.user.id,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  // get notifications by user id
  async getNotificationsByUserId(
    getNotificationByUserIdParamDto: GetNotificationByUserIdParamDto,
  ): Promise<GetNotificationByIdResponseInterface[]> {
    const { id } = getNotificationByUserIdParamDto;
    const notifications = await this.find({
      where: { user: { id: id } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      notificationType: notification.notificationType,
      data: notification.data,
      userId: notification.user.id,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }));
  }

  // send notification
  async sendNotification(
    title: string,
    body: string,
    userIds: string[],
    payload: any,
  ): Promise<{ message: string; failedTokens?: string[]; error?: string }> {
    const failedTokens: string[] = [];
    for (const userId of userIds) {
      // Find user entity
      const userEntity = await this.dataSource
        .getRepository(UserEntity)
        .findOne({ where: { id: userId } });

      if (!userEntity) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Find device entities with user entity
      const devices = await this.dataSource
        .getRepository(DeviceEntity)
        .find({ where: { user: { id: userId } } });

      if (!devices.length) {
        throw new NotFoundException(
          `Device not found for user with ID ${userId}`,
        );
      }

      // Filter to get device tokens
      const deviceTokens = devices.map((device) => device.deviceToken);

      // Create params object
      const params: IMessaginToTokensParams = {
        tokens: deviceTokens,
        title,
        body,
        payload,
      };

      try {
        const result = await this.messagingService.sendMessageToTokens(params);
        console.log(result);
        if (result.length > 0) {
          failedTokens.push(...result);
        }
      } catch (error) {
        await this.removeInvalidTokens(deviceTokens);
        return {
          message: 'Failed to send notification.',
          error: error.message,
        };
      }
    }

    if (failedTokens.length > 0) {
      return {
        message: 'Notification sent with some failures.',
        failedTokens,
      };
    }

    return {
      message: 'Notification sent successfully!',
    };
  }

  async deleteOldNotifications(): Promise<void> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - 21);

    try {
      const oldNotifications = await this.find({
        where: { createdAt: LessThan(dateThreshold) },
      });

      if (oldNotifications.length > 0) {
        await this.remove(oldNotifications);
        logger.info('Old notifications deleted');
      } else {
        logger.info('No old notifications');
      }
    } catch (error) {
      logger.error(error);
      throw new InternalServerErrorException(
        'Failed to delete old notifications',
      );
    }
  }

  async removeInvalidTokens(tokens: string[]): Promise<void> {
    try {
      await this.dataSource
        .getRepository(DeviceEntity)
        .delete({ deviceToken: In(tokens) });
      logger.info('Invalid tokens removed');
    } catch (error) {
      logger.error('Failed to remove invalid tokens', error);
      throw new InternalServerErrorException('Failed to remove invalid tokens');
    }
  }
}
