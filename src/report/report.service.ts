import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';
import { ReportStatus } from './enums/report-status.enum';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async createReport(
    createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.createReport(createReportDto);
  }

  async updateReportStatus(
    reportId: string,
    status: ReportStatus,
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.updateReportStatus(reportId, status);
  }

  async findReportById(id: string): Promise<ReportResponseInterface> {
    return this.reportRepository.findReportById(id);
  }

  async findAllReports(): Promise<ReportResponseInterface[]> {
    return this.reportRepository.findAllReports();
  }

  async findReportsByReporter(
    reporterId: string,
  ): Promise<ReportResponseInterface[]> {
    return this.reportRepository.findReportsByReporter(reporterId);
  }
}
