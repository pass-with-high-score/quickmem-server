import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ReportEntity, dataSource.createEntityManager());
  }
}
