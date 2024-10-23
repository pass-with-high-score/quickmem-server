import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateReportDto } from './dto/bodies/create-report.dto';
import { ReportResponseInterface } from './interfaces/report-response.interface';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async createReport(
    createReportDto: CreateReportDto,
  ): Promise<ReportResponseInterface> {
    return this.reportRepository.createReport(createReportDto);
  }
}
