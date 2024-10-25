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
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.createReport(createReportDto);
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
