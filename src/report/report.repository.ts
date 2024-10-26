import { CreateReportDto } from './dto/bodies/create-report.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UserEntity } from 'src/auth/entities/user.entity';
import { UpdateStatusParamDto } from './dto/params/update-status-param.dto';
import { UpdateStatusDto } from './dto/bodies/update-status.dto';
import { ReportStatusEnum } from './enums/report-status.enum';
import { GetReporterIdParamDto } from './dto/params/get-reporterId-param.dto';

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
    report.status = ReportStatusEnum.PENDING;

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
    updateStatusParamDto: UpdateStatusParamDto,
    updateStatusDto: UpdateStatusDto,
  ): Promise<ReportResponseInterface> {
    const { status } = updateStatusDto;
    const { id } = updateStatusParamDto;
    const report = await this.findOne({
      where: { id: id },
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

  async findReportById(
    updateStatusParamDto: UpdateStatusParamDto,
  ): Promise<ReportResponseInterface> {
    const { id } = updateStatusParamDto;
    const report = await this.findOne({
      where: { id: id },
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
    getReporterIdParamDto: GetReporterIdParamDto
  ): Promise<ReportResponseInterface[]> {
    const { reporterId } = getReporterIdParamDto;
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
