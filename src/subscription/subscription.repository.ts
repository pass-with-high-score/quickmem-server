import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SubscriptionEntity } from './entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends Repository<SubscriptionEntity> {
  constructor(private dataSource: DataSource) {
    super(SubscriptionEntity, dataSource.createEntityManager());
  }
}
