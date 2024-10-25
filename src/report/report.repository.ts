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

  async createReport(
    createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    const { reason, reportedEntityId, reportedType, reporterId } =
      createReportDto;

    const reporter = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: reporterId },
      relations: ['reports'],
    });
    if (!reporter) {
      throw new NotFoundException('Reporter not found');
    }

    const report = new ReportEntity();
    report.reason = reason;
    report.reportedEntityId = reportedEntityId;
    report.reportedType = reportedType;
    report.reporter = reporter;
    report.status = 'pending';

    try {
      await this.dataSource.getRepository(ReportEntity).save(report);
      return {
        id: report.id,
        reason: report.reason,
        reportedEntityId: report.reportedEntityId,
        reporter: report.reporter.id,
        reportedType: report.reportedType,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      };
    } catch (error) {
      console.log('Error creating report:', error);
      throw new Error('Error creating report');
    }
  }

  async updateReportStatus(
    reportId: string,
    status: string,
  ): Promise<ReportResponseInterface> {
    console.log('reportId', reportId);
    const report = await this.findOne({
      where: { id: reportId },
      relations: ['reporter'],
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = status;

    try {
      await this.save(report);
      return {
        id: report.id,
        reason: report.reason,
        reportedEntityId: report.reportedEntityId,
        reporter: report.reporter.id,
        reportedType: report.reportedType,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      };
    } catch (error) {
      console.log('Error updating report status:', error);
      throw new Error('Error updating report status');
    }
  }

  async findReportById(id: string): Promise<ReportResponseInterface> {
    const report = await this.findOne({
      where: { id },
      relations: ['reporter'],
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return {
      id: report.id,
      reason: report.reason,
      reportedEntityId: report.reportedEntityId,
      reporter: report.reporter.id,
      reportedType: report.reportedType,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }

  async findAllReports(): Promise<ReportResponseInterface[]> {
    const reports = await this.find();
    return reports.map((report) => ({
      id: report.id,
      reason: report.reason,
      reportedEntityId: report.reportedEntityId,
      reporter: report.reporter.id,
      reportedType: report.reportedType,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));
  }

  async findReportsByReporter(
    reporterId: string,
  ): Promise<ReportResponseInterface[]> {
    const reporter = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: reporterId },
      relations: ['reports'],
    });
    if (!reporter) {
      throw new NotFoundException('Reporter not found');
    }

    const reports = await this.find({
      where: { reporter: { id: reporterId } },
      relations: ['reporter'],
    });
    return reports.map((report) => ({
      id: report.id,
      reason: report.reason,
      reportedEntityId: report.reportedEntityId,
      reporter: report.reporter.id,
      reportedType: report.reportedType,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    }));
  }
}
