import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ReportEntity, dataSource.createEntityManager());
  }

  // Todo: Implement the following methods
  // create report
  // update report
  // delete report
  // get report by id
  // get reports by user id
  // get reports of a specific type
}
