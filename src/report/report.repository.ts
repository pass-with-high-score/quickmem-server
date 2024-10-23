import { CreateReportDto } from './dto/bodies/create-report.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UserEntity } from 'src/auth/entities/user.entity';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ReportEntity, dataSource.createEntityManager());
  }
  // Todo: Implement the following methods
  // create report
  async createReport(
    createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    const { reason, reportedType, reporterId } = createReportDto;

    const reporter = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: reporterId });
    if (!reporter) {
      throw new NotFoundException('Reporter not found');
    }

    const report = new ReportEntity();
    report.reason = reason;
    report.reportedType = reportedType;
    report.reporter = reporter;

    try {
      await this.dataSource.getRepository(ReportEntity).save(report);
      return {
        id: report.id,
        reason: report.reason,
        reportedType: report.reportedType,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      };
    } catch (error) {
      console.log('Error creating report:', error);
      throw new Error('Error creating report');
    }
  }


}
