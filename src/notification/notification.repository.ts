import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(NotificationEntity, dataSource.createEntityManager());
  }
}
