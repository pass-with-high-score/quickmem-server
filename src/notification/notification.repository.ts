import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(NotificationEntity, dataSource.createEntityManager());
  }

  // Todo: Implement the following methods
  // create notification
  // update notification
  // delete notification
  // get notification by id
  // get notifications by user id
}
