import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StreakEntity } from './entities/streak.entity';

@Injectable()
export class StreakRepository extends Repository<StreakEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(StreakEntity, dataSource.createEntityManager());
  }
}
