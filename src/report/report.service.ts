import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { UpdateStatusParamDto } from './dto/params/update-status-param.dto';
import { UpdateStatusDto } from './dto/bodies/update-status.dto';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async createReport(
    createReportDto: CreateReportDto,
    reporterId: string,
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.createReport(createReportDto, reporterId);
  }

  async updateReportStatus(
    updateStatusParamDto: UpdateStatusParamDto,
    updateStatusDto: UpdateStatusDto,
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.updateReportStatus(
      updateStatusParamDto,
      updateStatusDto,
    );
  }

  async getReportById(
    updateStatusParamDto: UpdateStatusParamDto,
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.getReportById(updateStatusParamDto);
  }

  async getReports(): Promise<ReportResponseInterface[]> {
    return this.reportRepository.getReports();
  }

  async getReportsByReporter(
    userId: string,
  ): Promise<ReportResponseInterface[]> {
    return this.reportRepository.getReportsByReporter(userId);
  }
}
