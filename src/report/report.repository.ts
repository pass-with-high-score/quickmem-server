import { CreateReportDto } from './dto/bodies/create-report.dto';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UserEntity } from 'src/auth/entities/user.entity';
import { UpdateStatusParamDto } from './dto/params/update-status-param.dto';
import { UpdateStatusDto } from './dto/bodies/update-status.dto';
import { ReportStatusEnum } from './enums/report-status.enum';
import { GetReporterIdParamDto } from './dto/params/get-reporterId-param.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypeEnum } from '../notification/enums/notification-type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReportRepository extends Repository<ReportEntity> {
  constructor(
    private readonly dataSource: DataSource,
    @InjectQueue('send-email-report') private readonly sendEmailQueue: Queue,
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {
    super(ReportEntity, dataSource.createEntityManager());
  }

  async createReport(
    createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    const {
      reason,
      reportedEntityId,
      reportedType,
      reporterId,
      ownerOfReportedEntityId,
    } = createReportDto;

    const reporter = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: reporterId },
    });
    if (!reporter) {
      throw new NotFoundException('Reporter not found');
    }

    if (reporter.id === ownerOfReportedEntityId) {
      throw new InternalServerErrorException('You cannot report yourself');
    }

    const ownerOfReportedEntity = await this.dataSource
      .getRepository(UserEntity)
      .findOne({
        where: { id: ownerOfReportedEntityId },
      });

    const report = new ReportEntity();
    report.reason = reason;
    report.reportedEntityId = reportedEntityId;
    report.reportedType = reportedType;
    report.reporter = reporter;
    report.status = ReportStatusEnum.PENDING;
    report.ownerOfReportedEntity = ownerOfReportedEntity;

    try {
      await this.dataSource.getRepository(ReportEntity).save(report);

      // Send email
      await this.sendEmailQueue.add('send-report-create', {
        email: reporter.email,
        from: `QuickMem <${this.configService.get('MAILER_USER')}>`,
        subject: 'New Report Created',
        reporter: {
          username: reporter.username,
        },
        reason: reason,
      });

      // Send notification
      await this.notificationService.createNotification({
        title: 'New Report Created',
        message: `A new report has been created with reason: ${reason}`,
        userId: [reporter.id],
        notificationType: NotificationTypeEnum.REPORT_CREATED,
        data: {
          reportId: report.id,
        },
      });

      return this.mapReportToReportResponse(report);
    } catch (error) {
      console.log('Error creating report:', error);
      throw new InternalServerErrorException('Error creating report');
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
      relations: ['reporter', 'ownerOfReportedEntity'],
    });
    if (!report) {
      throw new InternalServerErrorException('Report not found');
    }

    report.status = status;

    try {
      await this.save(report);
      return this.mapReportToReportResponse(report);
    } catch (error) {
      console.log('Error updating report status:', error);
      throw new InternalServerErrorException('Error updating report status');
    }
  }

  async getReportById(
    updateStatusParamDto: UpdateStatusParamDto,
  ): Promise<ReportResponseInterface> {
    const { id } = updateStatusParamDto;
    try {
      const report = await this.dataSource.getRepository(ReportEntity).findOne({
        where: { id: id },
        relations: ['reporter'],
      });
      if (!report) {
        throw new NotFoundException('Report not found');
      }
      return this.mapReportToReportResponse(report);
    } catch (error) {
      console.error('Error fetching report by ID:', error);
      throw new InternalServerErrorException('Error fetching report by ID');
    }
  }

  async getReports(): Promise<ReportResponseInterface[]> {
    try {
      const reports = await this.dataSource.getRepository(ReportEntity).find({
        relations: ['reporter'],
      });

      return reports.map((report) => this.mapReportToReportResponse(report));
    } catch (error) {
      console.log('Error getting reports:', error);
      throw new InternalServerErrorException('Error getting reports');
    }
  }

  async getReportsByReporter(
    getReporterIdParamDto: GetReporterIdParamDto,
  ): Promise<ReportResponseInterface[]> {
    const { id } = getReporterIdParamDto;
    try {
      const reports = await this.dataSource.getRepository(ReportEntity).find({
        where: { reporter: { id: id } },
        relations: ['reporter', 'ownerOfReportedEntity'],
      });

      return reports.map((report) => this.mapReportToReportResponse(report));
    } catch (error) {
      console.log('Error getting reports by reporter:', error);
      throw new InternalServerErrorException(
        'Error getting reports by reporter',
      );
    }
  }

  private mapReportToReportResponse(
    report: ReportEntity,
  ): ReportResponseInterface {
    return {
      id: report.id,
      reason: report.reason,
      reportedEntityId: report.reportedEntityId,
      reporter: {
        id: report.reporter.id,
        username: report.reporter.username,
        email: report.reporter.email,
        fullName: report.reporter.fullName,
        avatarUrl: report.reporter.avatarUrl,
      },
      ownerOfReportedEntityId: {
        id: report.ownerOfReportedEntity.id,
        username: report.ownerOfReportedEntity.username,
        email: report.ownerOfReportedEntity.email,
        fullName: report.ownerOfReportedEntity.fullName,
        avatarUrl: report.ownerOfReportedEntity.avatarUrl,
      },
      reportedType: report.reportedType,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }
}
